var tagArray = ["games", "graphics", "utility", "3D", "multiplayer", "alternative-only", "snake", "module", "animation", "art", "experimental"]
// games,

var tags = {
	"games": { "fr": "jeux", "en-title": "all games", "fr-title": "Tout jeux confondus", "color": "#7bf840" },
	"graphics": { "fr": "graphique", "en-title": "Who have graphics", "fr-title": "ce qui est graphique", "color": "#8ac1d8" },
	"utility": { "fr": "utilitaire", "en-title": "What serves a purpose", "fr-title": "Ce qui sert à quelque chose", "color": "#0000cc" },
	"3D": { "fr": "3D", "en-title": "Which uses 3D technology", "fr-title": "Ce qui utilise une technologie 3D", "color": "#442a10" },
	"multiplayer": { "fr": "multijoueurs", "en-title": "Which is played by several people", "fr-title": "Qui se joue à plusieurs", "color": "#6205a9" },
	"alternative-only": { "fr": "alternative-only", "en-title": "Can only be used on Upsilon/Omega", "fr-title": "Utilisable que sur Upsilon/Omega", "color": "#c53431" },
	"snake": { "fr": "snake", "en-title": "a classic snake game", "fr-title": "un jeu snake classique", "color": "#9b73d9" },
	"module": { "fr": "module", "en-title": "Library to use", "fr-title": "Bibliothèque à utiliser", "color": "#cbe1d9" },
	"animation": { "fr": "animation", "en-title": "", "fr-title": "", "color": "#cc5500" },
	"art": { "fr": "art", "en-title": "", "fr-title": "", "color": "rgb(142,0,255)" },
	"experimental": { "fr": "experimental", "en-title": "", "fr-title": "", "color": "#00cc00" }
}

var query = {
	"with": [],
	"without": [],
}


const getURLParameters = url =>
	(url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
		(a, v) => (
			(a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
		),
		{}
	);

var args = getURLParameters(document.URL);
console.log(args);

query["with"]=(args["wanted"]?.split("+")||[]).filter(a => tagArray.indexOf(a) > -1)

query["without"]=(args["denied"]?.split("+")||[]).filter(a => tagArray.indexOf(a) > -1)

scripts=scripts.filter(script => (script?.release||0)<new Date().getTime())

function getClass(txt) {
	txt = txt.toLowerCase();
	txt = txt.replace(/[0-9]/, "");
	return txt;
}

function createTagHTML(tagName){
	let tagHTML=`<span onclick="transfert('${tagName}');" title="${tags[tagName]["fr-title"]}" class="tag ${getClass(tagName)}">${tags[tagName]["fr"]}</span> `;
	return tagHTML;
}

var divWorkshop = document.getElementById("workshop");

var tagDiv = {
	"other": document.getElementById("other"),
	"denied": document.getElementById("denied"),
	"search": document.getElementById("search"),
}

var style = document.createElement("style");
style.type = "text/css";
for (var i = 0; i < tagArray.length; i++) {
	let color = tags[tagArray[i]]["color"];
	style.innerHTML += ` span.tag.${getClass(tagArray[i])} { color: ${color}; border-color: ${color}; }\n`;
}
document.head.appendChild(style);

function select(with_ = [], without = []) {
	return scripts.filter(
		script => (
			with_.filter(
				n => script["tags"].indexOf(n) > -1
			).length == with_.length
			&& without.filter(
				n => script["tags"].indexOf(n) > -1
			).length == 0 )
	);
}

function show(scripts2show = scripts) {
	completeAddDiv = "";
	authors = [];
	for (var i = scripts2show.length - 1; i >= 0; i--) {
		let script = scripts2show[i];
		let link;
		let authorLink;
		let addDiv = '<div class="script">';
		if(script?.upsilonLink){
			link = script.upsilonLink;
			authorLink = `https://yaya-cout.github.io/Upsilon-Workshop/user/${script["author"]}`;
		}else{
			link = `https://my.numworks.com/python/${script["author"]}/${script["name"]}`;
			authorLink = `https://my.numworks.com/python/${script["author"]}`;
		}
		let imgSrc = 'https://antarctus.github.io/alt-num/images/' + (script["extension"] || script["author"] + "-" + script["name"] + ".png");
		addDiv += `<h2><a href="${link}">${script["name"]}</a> de <a href="${authorLink}">${script["author"]}</a> </h2>`;
		addDiv += `<p><img alt="screenshot of ${script["name"]}" src="${imgSrc}" loading="lazy"><br>`;
		for (var j = 0; j < (script["tags"] || []).length; j++) {
			addDiv += createTagHTML(script["tags"][j]);
		}
		addDiv += "</p></div>";
		completeAddDiv += addDiv;
		if (authors[scripts2show[i].author] == undefined) {
			authors.push(scripts2show[i].author);
			authors[scripts2show[i].author] = 0;
		}
		authors[scripts2show[i].author] += 1;
	}
	divWorkshop.innerHTML = '<p style="color:#555;font-style: italic;">' + scripts2show.length + ' programmes de ' + authors.length + ' Programmeurs.</p>';
	divWorkshop.innerHTML += completeAddDiv;
}

function transfert(tag) {
	if (query["with"].indexOf(tag) != -1) {
		query["with"] = query["with"].filter(elem => elem != tag);
		query["without"].push(tag);
	} else if (query["without"].indexOf(tag) != -1) {
		query["without"] = query["without"].filter(elem => elem != tag);
	} else {
		query["with"].push(tag);
	}
	update();
}

function update() {
	show(select(query["with"], query["without"]));
	var innerHTML_ = {
		"other": '<span class="tag_title">Autres : &#160</span>',
		"denied": '<span class="tag_title">Refusés : &#160</span>',
		"search": '<span class="tag_title">Voulus : &#160</span>',
	}
	for (var i = 0; i < tagArray.length; i++) {
		let txt = createTagHTML(tagArray[i]);
		if (query["with"].indexOf(tagArray[i]) != -1) {
			innerHTML_["search"] += txt;
		} else if (query["without"].indexOf(tagArray[i]) != -1) {
			innerHTML_["denied"] += txt;
		} else {
			innerHTML_["other"] += txt;
		}
	}
	tagDiv["other"].innerHTML = innerHTML_["other"];
	tagDiv["denied"].innerHTML = innerHTML_["denied"];
	tagDiv["search"].innerHTML = innerHTML_["search"];

	var getQuery = "";
	if (query["with"].length > 0 || query["without"].length > 0) {
		getQuery = "?";
	} if (query["with"].length) {
		getQuery = getQuery + "wanted=" + query["with"].join("+");
	} if (query["with"].length > 0 && query["without"].length > 0) {
		getQuery = getQuery + "&";
	} if (query["without"].length) {
		getQuery = getQuery + "denied=" + query["without"].join("+");
	}

	// Current URL: https://numworks.antarctus.repl.co/
	const nextURL = 'https://antarctus.github.io/alt-num/' + getQuery;
	const nextTitle = 'Le shop alternatif';
	const nextState = { additionalInformation: 'Updated the URL with JS' };

	// This will create a new entry in the browser's history, without reloading
	window.history.replaceState(nextState, nextTitle, nextURL);

}

update();

/*
var a = document.createElement("a");
a.href=(document.getElementById("canvas")||document.querySelector("canvas")).toDataURL();
a.download=document.querySelector(".col-description").children[1].children[0].innerHTML+"-"+document.querySelector(".col-description").children[0].innerHTML.split('.')[0] +".png";
a.click(); 
*/
