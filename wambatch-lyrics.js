(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global['wambatch-lyrics'] = {}));
}(this, (function (exports) { 'use strict';

  /**
   * Find first audio or video element before lyrics element. Only used when
   * no mediaElement was specified. If nothing found, return null.
   */
  function findMediaElement(element) {
    if (element.dataset.media) {
      var mediaElement = document.querySelector(element.dataset.media);
      if (mediaElement) return mediaElement;
    }

    var previousElement = element.previousElementSibling; // First, lookup siblings before

    while (previousElement) {
      if (previousElement.tagName.toLowerCase() === 'audio' || previousElement.tagName.toLowerCase() === 'video') {
        return previousElement;
      } else {
        var mediaChildren = previousElement.querySelectorAll('audio, video');

        if (mediaChildren.length > 0) {
          return mediaChildren.item(mediaChildren.length - 1);
        }
      }

      previousElement = previousElement.previousElementSibling;
    }

    if (element.parentElement) {
      return findMediaElement(element.parentElement);
    } else {
      return null;
    }
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  /** Parse timestamp and return number in seconds */
  function parseTimestamp(timestamp) {
    if (!timestamp || typeof timestamp !== 'string') return 0;
    var results; // [hh:mm:ss.xx] format, used by audio books

    results = timestamp.match(/\[(\d+):(\d+):(\d+\.\d+)\]/);

    if (results && results.length === 4) {
      return parseInt(results[1]) * 60 * 60 + parseInt(results[2]) * 60 + parseFloat(results[3]);
    } // [mm:ss.xx] format, used for songs


    results = timestamp.match(/\[(\d+):(\d+\.\d+)\]/);

    if (results && results.length === 3) {
      return parseInt(results[1]) * 60 + parseFloat(results[2]);
    }

    return 0;
  }

  var timeRegex = /\[(\d+:)?\d+:\d+\.\d+\]/;
  var startRegex = /^\[(\d+:)?\d+:\d+\.\d+\]/;
  var endRegex = /\[(\d+:)?\d+:\d+\.\d+\]$/;
  function parseLyrics(source) {
    var lines = source.trim().split(/\r\n|\n|\r/).map(function (line) {
      return line.trim();
    });
    var results = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var startMatch = line.match(startRegex);
      var endMatch = line.match(endRegex); // Infinity will be replaced later by checking the context

      var startsAt = startMatch ? parseTimestamp(startMatch[0]) : Infinity;
      var endsAt = endMatch ? parseTimestamp(endMatch[0]) : Infinity;
      var content = parseLyricsLine(line);
      results.push({
        startsAt: startsAt,
        endsAt: endsAt,
        content: content
      });
    }

    fillMissingEndTimestamps(results);
    fillMissingStartTimestamps(results);
    return results;
  }

  function parseLyricsLine(source) {
    var results = [];
    var pointer = 0;
    var lastTime = Infinity;

    while (pointer < source.length) {
      var match = source.substr(pointer).match(timeRegex);

      if (match && match[0] && typeof match.index !== 'undefined') {
        var time = parseTimestamp(match[0]);

        if (match.index > 0) {
          results.push({
            startsAt: lastTime,
            endsAt: time,
            content: source.substr(pointer, match.index)
          });
        }

        lastTime = time;
        pointer += match.index + match[0].length;
      } else {
        results.push({
          startsAt: lastTime,
          endsAt: Infinity,
          content: source.substr(pointer)
        });
        pointer = source.length;
      }
    }

    return results;
  }

  function fillMissingStartTimestamps(results) {
    var lastTime = Infinity;

    for (var i = 0; i < results.length; i++) {
      if (results[i].startsAt === Infinity) {
        results[i].startsAt = lastTime;
      } else {
        lastTime = results[i].startsAt;
      }

      for (var j = 0; j < results[i].content.length; j++) {
        if (results[i].content[j].startsAt === Infinity) {
          results[i].content[j].startsAt = lastTime;
        } else {
          lastTime = results[i].content[j].startsAt;
        }
      }
    }
  }

  function fillMissingEndTimestamps(results) {
    var lastTime = Infinity;

    for (var i = results.length - 1; i >= 0; i--) {
      if (results[i].endsAt === Infinity) {
        results[i].endsAt = lastTime;
      } else {
        lastTime = results[i].endsAt;
      }

      for (var j = results[i].content.length - 1; j >= 0; j--) {
        if (results[i].content[j].endsAt === Infinity) {
          results[i].content[j].endsAt = lastTime;
        } else {
          lastTime = results[i].content[j].endsAt;
        }

        if (results[i].content[j].startsAt !== Infinity) {
          lastTime = results[i].content[j].startsAt;
        }
      }

      if (results[i].startsAt !== Infinity) {
        lastTime = results[i].startsAt;
      }
    }
  }

  /**
   * RabbitLyrics main controller.
   */

  var RabbitLyrics = /*#__PURE__*/function () {
    function RabbitLyrics(
    /** Lyrics container element. Support data-* attributes for options. */
    lyricsElement,
    /** Audio or video element. Note: embeded media elements in <iframe> are not supported. */
    mediaElement,
    /** Lyrics options. */
    options) {
      var _this = this;

      this.lyricsElement = lyricsElement;
      this.mediaElement = mediaElement;
      this.viewMode = 'clip';
      this.alignment = 'center';
      this.lyrics = '';
      this.lyricsLines = [];

      this.handleStatusChange = function (e) {
        var status; // playing, paused, waiting, ended

        switch (e.type) {
          case 'play':
          case 'playing':
            status = 'playing';
            break;

          case 'pause':
            status = 'paused';
            break;

          case 'waiting':
            status = 'waiting';
            break;

          case 'ended':
            status = 'ended';
            break;
        }

        _this.lyricsElement.classList.remove('wambatch-lyrics--playing', 'wambatch-lyrics--paused', 'wambatch-lyrics--waiting', 'wambatch-lyrics--ended');

        if (status) {
          _this.lyricsElement.classList.add('wambatch-lyrics--' + status);
        }
      };
      /**
       * Synchronize media element time and lyrics lines
       */


      this.synchronize = function () {
        var time = _this.mediaElement.currentTime;
        var changed = false; // If here are active lines changed

        var activeLines = _this.lyricsLines.filter(function (line) {
          if (time >= line.startsAt && time < line.endsAt) {
            // If line should be active
            if (!line.element.classList.contains('wambatch-lyrics__line--active')) {
              // If it hasn't been activated
              changed = true;
              line.element.classList.add('wambatch-lyrics__line--active');
            }

            line.content.forEach(function (inline) {
              if (time >= inline.startsAt) {
                inline.element.classList.add('wambatch-lyrics__inline--active');
              } else {
                inline.element.classList.remove('wambatch-lyrics__inline--active');
              }
            });
            return true;
          } else {
            // If line should be inactive
            if (line.element.classList.contains('wambatch-lyrics__line--active')) {
              // If it hasn't been deactivated
              changed = true;
              line.element.classList.remove('wambatch-lyrics__line--active');
              line.content.forEach(function (inline) {
                inline.element.classList.remove('wambatch-lyrics__inline--active');
              });
            }

            return false;
          }
        });

        if (changed && activeLines.length > 0) {
          // Calculate scroll top. Vertically align active lines in middle
          var activeLinesOffsetTop = (activeLines[0].element.offsetTop + activeLines[activeLines.length - 1].element.offsetTop + activeLines[activeLines.length - 1].element.offsetHeight) / 2;
          _this.lyricsElement.scrollTop = activeLinesOffsetTop - _this.lyricsElement.clientHeight / 2;
        }
      };

      if (this.lyricsElement.rabbitLyrics) {
        // Return existing instance to avoid duplicates
        return this.lyricsElement.rabbitLyrics;
      } // Bind new instance to lyrics element


      this.lyricsElement.rabbitLyrics = this; // Merge element attribute options

      Object.assign(this, this.getOptionsFromAttributes()); // Merge user specified options

      if (options) {
        Object.assign(this, options);
      }

      this.render(); // Bind this to event handlers
      // Rest scroll bar

      this.lyricsElement.scrollTop = 0; // Bind playback update events

      this.mediaElement.addEventListener('timeupdate', this.synchronize);
      this.mediaElement.addEventListener('play', this.handleStatusChange);
      this.mediaElement.addEventListener('playing', this.handleStatusChange);
      this.mediaElement.addEventListener('pause', this.handleStatusChange);
      this.mediaElement.addEventListener('waiting', this.handleStatusChange);
      this.mediaElement.addEventListener('ended', this.handleStatusChange);
    }
    /** Change lyrics content and re-render views */


    var _proto = RabbitLyrics.prototype;

    _proto.setLyrics = function setLyrics(lyrics) {
      this.lyrics = lyrics;
      this.render();
    }
    /** Change alignment */
    ;

    _proto.setAlignment = function setAlignment(alignment) {
      this.alignment = alignment;
      this.lyricsElement.classList.remove('wambatch-lyrics--center', 'wambatch-lyrics--left', 'wambatch-lyrics--right');
      this.lyricsElement.classList.add('wambatch-lyrics--' + this.alignment);
    }
    /** Change alignment */
    ;

    _proto.setViewMode = function setViewMode(viewMode) {
      this.viewMode = viewMode;
      this.lyricsElement.classList.remove('wambatch-lyrics--clip', 'wambatch-lyrics--full', 'wambatch-lyrics--mini');
      this.lyricsElement.classList.add('wambatch-lyrics--' + this.viewMode);
    };

    _proto.render = function render() {
      var _this2 = this;

      // Add class names
      this.lyricsElement.classList.add('wambatch-lyrics');
      this.lyricsElement.classList.add('wambatch-lyrics--' + this.viewMode);
      this.lyricsElement.classList.add('wambatch-lyrics--' + this.alignment);
      this.lyricsElement.textContent = null; // Render lyrics lines

      this.lyricsLines = parseLyrics(this.lyrics).map(function (line) {
        var lineElement = document.createElement('div');
        lineElement.className = 'wambatch-lyrics__line';
        lineElement.addEventListener('click', function () {
          _this2.mediaElement.currentTime = line.startsAt;

          _this2.synchronize();
        });
        var lineContent = line.content.map(function (inline) {
          var inlineElement = document.createElement('span');
          inlineElement.className = 'wambatch-lyrics__inline';
          inlineElement.textContent = inline.content;
          lineElement.append(inlineElement);
          return _extends({}, inline, {
            element: inlineElement
          });
        });

        _this2.lyricsElement.append(lineElement);

        return _extends({}, line, {
          content: lineContent,
          element: lineElement
        });
      });
      this.synchronize();
    };

    _proto.getOptionsFromAttributes = function getOptionsFromAttributes() {
      var _this$lyricsElement$t;

      var options = {};

      if ((_this$lyricsElement$t = this.lyricsElement.textContent) != null && _this$lyricsElement$t.trim()) {
        options.lyrics = this.lyricsElement.textContent.trim();
      }

      if (this.lyricsElement.dataset.viewMode) {
        options.viewMode = this.lyricsElement.dataset.viewMode;
      }

      if (this.lyricsElement.dataset.alignment) {
        options.alignment = this.lyricsElement.dataset.alignment;
      }

      return options;
    };

    return RabbitLyrics;
  }();

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".wambatch-lyrics{position:relative;padding:1em 0;height:16.5em;overflow-x:hidden;overflow-y:auto;scroll-behavior:smooth;background-color:#fff;border:1px solid #ddd}.wambatch-lyrics--center{text-align:center}.wambatch-lyrics--left{text-align:left}.wambatch-lyrics--right{text-align:right}.wambatch-lyrics__line{line-height:1.5em;min-height:1.5em;padding:0 1em}.wambatch-lyrics__line--active{background-color:rgba(0,0,0,.1)}.wambatch-lyrics__inline--active{color:#04a8a8}.wambatch-lyrics--mini{height:1.5em;overflow-y:hidden}.wambatch-lyrics--mini .wambatch-lyrics__line{display:none}.wambatch-lyrics--mini .wambatch-lyrics__line--active{display:block;background:transparent}.wambatch-lyrics--full{height:auto;overflow-y:initial}";
  styleInject(css_248z);

  /*
   * Rabbit Lyrics
   *
   * JavaScript audio and timed lyrics synchronizer. No jQuery required.
   *
   * License: GNU General Public License version 3
   * Author: Guo Yunhe <i@guoyunhe.com>
   * Repository: https://github.com/guoyunhe/wambatch-lyrics
   */

  document.addEventListener('DOMContentLoaded', function () {
    var elements = document.getElementsByClassName('wambatch-lyrics');

    for (var i = 0; i < elements.length; i++) {
      var lyricsElement = elements.item(i);

      if (lyricsElement) {
        var mediaElement = findMediaElement(lyricsElement);

        if (mediaElement) {
          new RabbitLyrics(lyricsElement, mediaElement);
        }
      }
    }
  }, false);

  exports.default = RabbitLyrics;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=wambatch-lyrics.umd.development.js.map
