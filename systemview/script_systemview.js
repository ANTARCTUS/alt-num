
var elemUsers=document.getElementById("users");
var elemScripts=document.getElementById("scripts");
users=[];
users_={};

function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);
	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

//var args=$_GET();
//alert(args["author"]);


for(var i=0;i<scripts.length;i++){
	elemScripts.innerHTML+="<li>"+scripts[i].name+"</li>\n";
	if(users.indexOf(scripts[i].author)==-1){
		users.push(scripts[i].author);
		users_[scripts[i].author]=0;
	}
	users_[scripts[i].author]+=1;
}

for(var i=0;i<users.length;i++){
	elemUsers.innerHTML+="<li>"+users[i]+" ("+users_[users[i]]+")"+"</li>\n";
}