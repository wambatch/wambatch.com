
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Facebook Like Box</title>
<meta content='width=device-width, initial-scale=1' name='viewport'>
<style>
body {
  background-color:transparent;
  margin:0;
  padding:0;
}
iframe{border:0}
</style>
<script>
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}
var labelnya = getQueryVariable("label");
</script>
</head>
<body>
<script>
var posts_no = 8;
var showpoststhumbs = true;var readmorelink = false;var showcommentslink = false;var posts_date = true;var post_summary = false;var summary_chars = 0;function recentost(t){document.write('<ul class="recent-post">');for(var e=0;e<posts_no;e++){var r,n=t.feed.entry[e],i=n.title.$t;if(e==t.feed.entry.length)break;for(var o=0;o<n.link.length;o++){if("replies"==n.link[o].rel&&"text/html"==n.link[o].type)var l=n.link[o].title,m=n.link[o].href;if("alternate"==n.link[o].rel){r=n.link[o].href;break}}var u;try{u=n.media$thumbnail.url}catch(h){s=n.content.$t,a=s.indexOf("<img"),b=s.indexOf('src="',a),c=s.indexOf('"',b+130),d=s.substr(b+130,c-b-130),u=-130!=a&&-130!=b&&-130!=c&&""!=d?d:"https://2.bp.blogspot.com/-C3Mo0iKKiSw/VGdK808U7rI/AAAAAAAAAmI/W7Ae_dsEVAE/s1600/no-thumb.png"}
var p=n.published.$t,f=p.substring(0,4),g=p.substring(5,7),v=p.substring(8,10),w=new Array;if(w[1]="1",w[2]="2",w[3]="3",w[4]="4",w[5]="5",w[6]="6",w[7]="7",w[8]="8",w[9]="9",w[10]="10",w[11]="11",w[12]="12",document.write('<li class="post"><div class="post-inner"><div class="thumbnail"><a href="'+r+'" title="'+i+'"><div class="thumbnail-overlay"></div>'),
1==showpoststhumbs&&document.write('<img class="recent-img" src="'+u+'" alt="'+i+'" title="'+i+'" width="500" height="500"/>'),
document.write("</a>"),document.write("</div>"),
"content"in n)var A=n.content.$t;else if("summary"in n)var A=n.summary.$t;else var A="";
var k=/<\S[^>]*>/g;if(A=A.replace(k,""),1==post_summary)if(A.length<summary_chars)document.write(A);else{A=A.substring(0,summary_chars);
var y=A.lastIndexOf(" ");A=A.substring(0,y),
document.write(A+"...")}var _="",$=0;
document.write('<div class="post-title-date"><h2 class="entry-title"><a href="'+r+'" title="'+i+'">'+i+'</a></h2><span class="post-date"><i class="fa fa-calendar-o"></i>'),
1==posts_date&&(_=_+w[parseInt(g,10)]+"/"+v+"/"+f,$=1),
1==readmorelink&&(1==$&&(_+=" </span>"),
_=_+'<span class="redmore"><a href="'+r+'" class="urls" target ="_top">Selengkapnya</a></span>',$=1),
1==showcommentslink&&(1==$&&(_+=" <br> "),"1 Comments"==l&&(l="1 Comment"),"0 Comments"==l&&(l="No Comments"),
l='<a href="'+m+'" target ="_top">'+l+"</a>",_+=l,$=1),
document.write(_),document.write("</div></div></li>")}document.write("</ul>")}
document.write("<script src='https://www.wambatch.com/feeds\/posts\/default/-/"+ labelnya +"?orderby=published&alt=json-in-script&callback=recentost'><\/script>");
</script>
<script>$('.recent-img').attr('src', function(i, src) 
{return src.replace('s72-c','w500-h500-c');})
</script>
<noscript>Your browser does not support JavaScript!</noscript>
</body>
</html>
