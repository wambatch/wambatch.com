function recentost(v){document.write('<ul id="recent-post">');for(var e=0;e<_contentx;e++){var u,o=v.feed.entry[e],i=o.title.$t;if(e==v.feed.entry.length){break}for(var p=0;p<o.link.length;p++){if("replies"==o.link[p].rel&&"text/html"==o.link[p].type){var l=o.link[p].title,m=o.link[p].href}if("alternate"==o.link[p].rel){u=o.link[p].href;break}}var y;try{y=o.media$thumbnail.url}catch(h){s=o.content.$t,a=s.indexOf("<img"),b=s.indexOf('src="',a),c=s.indexOf('"',b+130),d=s.substr(b+130,c-b-130),y=-130!=a&&-130!=b&&-130!=c&&""!=d?d:"https://2.bp.blogspot.com/-C3Mo0iKKiSw/VGdK808U7rI/AAAAAAAAAmI/W7Ae_dsEVAE/s1600/no-thumb.png"}var r=o.published.$t,f=r.substring(0,4),g=r.substring(5,7),k=r.substring(8,10),n=new Array;if(n[1]="Jan",n[2]="Feb",n[3]="Mar",n[4]="Apr",n[5]="May",n[6]="Jun",n[7]="Jul",n[8]="Aug",n[9]="Sep",n[10]="Oct",n[11]="Nov",n[12]="Dec",document.write('<li class="post"><div class="post-thumbnail"><a href="'+u+'">'),1==_imagex&&document.write('<img class="thumbnail-ost" src="'+y+'"/>'),document.write("<span>"+i+"</span></a>"),"content" in o){var t=o.content.$t}else{if("summary" in o){var t=o.summary.$t}else{var t=""}}var j=/<\S[^>]*>/g;if(t=t.replace(j,""),1==_snippx){if(t.length<_snipxchar){document.write(t)}else{t=t.substring(0,_snipxchar);var w=t.lastIndexOf(" ");t=t.substring(0,w),document.write(t+"...")}}document.write("</div></li>")}document.write("</ul>")};
