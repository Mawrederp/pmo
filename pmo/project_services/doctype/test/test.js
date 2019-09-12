// Copyright (c) 2019, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('test', {
	refresh: function(frm) {
		cur_frm.toggle_display("html_1", true);
		var table_data = frappe.render_template("collapsibles", { "doc": frm.doc });
		$(frm.fields_dict["html_1"].wrapper).html(table_data);
		refresh_field("html_1");

		document.getElementById("toggle").addEventListener("click", myFunction, false)


		// if($("[data-fieldname='html_1']").data('clicked')) {
		// console.log("clicked!");
		// }


// 		if ($('input#toggle').is(':checked')) {
// 			console.log("checked!");
// }





				 		   		// $(frm.fields_dict["your html field name"].wrapper).html(table_data);
				 		   		// refresh_field("your html field name");

		// var table = document.querySelector("[data-fieldname='section_name_0']");
		// // $(table).wrap('<a class="h6 uppercase">Project Financial Details</a>');
		// $(table).wrap('<input type="checkbox" onclick="myFunction()">');


		// $(table).html(table_data);
		// $(table).wrap('<input id="toggle" type="checkbox" ><label for="toggle">Hidden Kitten</label>');
		// $(table).append('<main><h2><button aria-expanded="false">Section 1<svg aria-hidden="true" focusable="false" viewBox="0 0 10 10"><rect class="vert" height="8" width="2" y="1" x="4"/><rect height="2" width="8" y="4" x="1"/></svg></button></h2><div hidden><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo purus quis mi cursus hendrerit eu eu metus. Aliquam aliquam arcu eget aliquet scelerisque. Pellentesque sodales turpis vitae venenatis vehicula. Ut id porta velit. Ut eu dignissim dui, quis gravida est. Cras quis venenatis mauris, a bibendum enim. Sed at augue libero. Nullam tortor metus, tincidunt ut urna id, posuere placerat orci. Ut quis risus dictum risus facilisis imperdiet quis sed eros.</p></div><h2></main>')


		// var elementClicked;
		// $(cur_frm.fields_dict["html_1"]).is( ":checked" ) {
		//    elementClicked = true;
		// };
		// if( elementClicked != true ) {
		//     alert("element not clicked");
		// 		console.log("Not clicked!");
		// }else{
		//     alert("element clicked");
		// 		console.log("clicked!");
		// };

		// $(table).wrap("<h1> wrap</h1>")

		// set_css(frm);

// 		$("div[data-fieldname='mygridBusinessModel']")[0];
//
// 		$(document).on('page-change', function(e) {
// 				console.log("do something");
// });



	}
});

function myFunction() {
			if ($('input#toggle').is(':checked')) {
				console.log("checked!");
	}
	else{
		console.log("Not checked!");
	}
// if (document.getElementById("toggle") == 1) {
// 	// $(table).wrap("<h1> - </h1>")
// 	document.querySelector("[data-fieldname='check_2']").style.cssText = 'font-size:20px;color:#8D99A6;content: "+";'
// 	// console.log(document.querySelector("[data-fieldname='project_financial_details']").style.cssText);
//
// 	console.log("tesst");
// 	document.querySelector("[data-fieldname='section_name_0']").style.display = "block";
// 	document.querySelector("[data-fieldname='original_project_quotation']").style.display = "block";
// 	document.querySelector("[data-fieldname='total_overhead_expenses_0']").style.display = "block";
// 	document.querySelector("[data-fieldname='resources_details_0']").style.display = "block";
//
//
//
// }
// else {
// 	// $(table).wrap("<h1> + </h1>")
// 	document.querySelector("[data-fieldname='section_name_0']").style.display = "none";
// 	document.querySelector("[data-fieldname='original_project_quotation']").style.display = "none";
// 	document.querySelector("[data-fieldname='total_overhead_expenses_0']").style.display = "none";
// 	document.querySelector("[data-fieldname='resources_details_0']").style.display = "none";
//
//
// }
};

var table = document.querySelector("[data-fieldname='section_name_0']");
// $(table).wrap('<input type="checkbox" id="load_bom_button">');
$(table).wrap('<a class="h6 uppercase" id="load_bom_button">Project Financial Details</a><input id="toggle" type="checkbox" checked>');

document.getElementById("load_bom_button").addEventListener("click", myFunction, false)


document.querySelector("[data-fieldname='check_1']").style.display = "block";


cur_frm.cscript.check_1 = function(doc, cdt, cdn) {
	var table = document.querySelector("[data-fieldname='check_1']");
if (cur_frm.doc.check_1 == 1) {
	// $(table).wrap("<h1> - </h1>")
	document.querySelector("[data-fieldname='check_1']").style.cssText = "font-size:20px;color:#8D99A6;content: '\f0a2';"
	// console.log(document.querySelector("[data-fieldname='project_financial_details']").style.cssText);

	console.log("tesst");
	document.querySelector("[data-fieldname='section_name_0']").style.display = "block";
	document.querySelector("[data-fieldname='original_project_quotation']").style.display = "block";
	document.querySelector("[data-fieldname='total_overhead_expenses_0']").style.display = "block";
	document.querySelector("[data-fieldname='resources_details_0']").style.display = "block";



}
else {
	// $(table).wrap("<h1> + </h1>")
	document.querySelector("[data-fieldname='section_name_0']").style.display = "none";
	document.querySelector("[data-fieldname='original_project_quotation']").style.display = "none";
	document.querySelector("[data-fieldname='total_overhead_expenses_0']").style.display = "none";
	document.querySelector("[data-fieldname='resources_details_0']").style.display = "none";


}
};

cur_frm.cscript.check_2 = function(doc, cdt, cdn) {
	var table = document.querySelector("[data-fieldname='check_2']");
if (cur_frm.doc.check_2 == 1) {
	// $(table).wrap("<h1> - </h1>")
	document.querySelector("[data-fieldname='check_2']").style.cssText = 'font-size:20px;color:#8D99A6;content: "+";'
	// console.log(document.querySelector("[data-fieldname='project_financial_details']").style.cssText);

	console.log("tesst");
	document.querySelector("[data-fieldname='items_details_0']").style.display = "block";
	document.querySelector("[data-fieldname='cost_0']").style.display = "block";
	document.querySelector("[data-fieldname='selling_price_0']").style.display = "block";
	document.querySelector("[data-fieldname='project_items']").style.display = "block";



}
else {
	// $(table).wrap("<h1> + </h1>")
	document.querySelector("[data-fieldname='items_details_0']").style.display = "none";
	document.querySelector("[data-fieldname='cost_0']").style.display = "none";
	document.querySelector("[data-fieldname='selling_price_0']").style.display = "none";
	document.querySelector("[data-fieldname='project_items']").style.display = "none";


}
};

cur_frm.cscript.check_3 = function(doc, cdt, cdn) {
	var table = document.querySelector("[data-fieldname='check_3']");
if (cur_frm.doc.check_3 == 1) {
	// $(table).wrap("<h1> - </h1>")
	document.querySelector("[data-fieldname='check_3']").style.cssText = 'font-size:20px;color:#8D99A6;content: "+";'
	// console.log(document.querySelector("[data-fieldname='project_financial_details']").style.cssText);

	console.log("tesst");
	document.querySelector("[data-fieldname='items_details']").style.display = "block";
	document.querySelector("[data-fieldname='selling_price']").style.display = "block";
	document.querySelector("[data-fieldname='section_name_2']").style.display = "block";
	document.querySelector("[data-fieldname='resources_details_2']").style.display = "block";




}
else {
	// $(table).wrap("<h1> + </h1>")
	document.querySelector("[data-fieldname='items_details']").style.display = "none";
	document.querySelector("[data-fieldname='selling_price']").style.display = "none";
	document.querySelector("[data-fieldname='section_name_2']").style.display = "none";
	document.querySelector("[data-fieldname='resources_details_2']").style.display = "none";


}
};

// var elementClicked;
// $(cur_frm.fields_dict["check_1"]).is( ":checked" ) {
//    elementClicked = true;
// };
// if( elementClicked != true ) {
//     alert("element not clicked");
// 		console.log("Not clicked!");
// }else{
//     alert("element clicked");
// 		console.log("clicked!");
// };

// cur_frm.cscript.html_1 = function (doc,cdt,cdn) {
// 	console.log("html!");
// };

// $("[data-fieldname='html_1']").data('clicked') {
// console.log("clicked html!");
// };
//
// $(cur_frm.fields_dict["check_1"]).is(':checked') {
// 			console.log("checked!");
// };

// $(cur_frm.fields_dict["check_1"]).wrap("<h1> wrap</h1>")



// '<script> (function() {const headings = document.querySelectorAll("h2");Array.prototype.forEach.call(headings, h => {let btn = h.querySelector("button");let target = h.nextElementSibling;btn.onclick = () => {let expanded = btn.getAttribute("aria-expanded") === "true";btn.setAttribute("aria-expanded", !expanded);target.hidden = expanded;  }});})()</script>'

// var table_data = frappe.render_template("collapsibles");

// var table_data = frappe.render_template("collapsibles", { "doc": frm.doc });
// $(frm.fields_dict["html_1"].wrapper).html(table_data);
// refresh_field("html_1");

		 		   		// $(frm.fields_dict["your html field name"].wrapper).html(table_data);
		 		   		// refresh_field("your html field name");

// var table = document.querySelector("[data-fieldname='section_name_0']");
//
// $(table).wrap("<h1> wrap</h1>")
// $(table).html(table_data);






// $(table).append('<script> var coll = document.getElementsByClassName("collapsible");var i;for (i = 0; i < coll.length; i++) {coll[i].addEventListener("click", function() {this.classList.toggle("active");var content = this.nextElementSibling;if (content.style.maxHeight){content.style.maxHeight = null;} else {content.style.maxHeight = content.scrollHeight + "px";}});}</script><button class="collapsible">Open Collapsible</button> <div class="content"> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p></div>');






// var set_css = function (frm) {
// 	document.querySelector("[data-fieldname='section_name_0']").style.display = "none";
//
// }

// var coll = document.getElementsByClassName("collapsible");
// var i;
//
// for (i = 0; i < coll.length; i++) {
//   coll[i].addEventListener("click", function() {
//     this.classList.toggle("active");
//     var content = this.nextElementSibling;
//     if (content.style.maxHeight){
//       content.style.maxHeight = null;
//     } else {
//       content.style.maxHeight = content.scrollHeight + "px";
//     }
//   });
// }



// $("p").append('<script> var coll = document.getElementsByClassName("collapsible");var i;for (i = 0; i < coll.length; i++) {coll[i].addEventListener("click", function() {this.classList.toggle("active");var content = this.nextElementSibling;if (content.style.maxHeight){content.style.maxHeight = null;} else {content.style.maxHeight = content.scrollHeight + "px";}});}</script><button class="collapsible">Open Collapsible</button> <div class="content"> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p></div>');

// '<script> var coll = document.getElementsByClassName("collapsible");var i;for (i = 0; i < coll.length; i++) {coll[i].addEventListener("click", function() {this.classList.toggle("active");var content = this.nextElementSibling;if (content.style.maxHeight){content.style.maxHeight = null;} else {content.style.maxHeight = content.scrollHeight + "px";}});}</script>'
// '<style>.collapsible { background-color: #777;color: white;cursor: pointer;padding: 18px;width: 100%;border: none;text-align: left;outline: none;font-size: 15px;}.active, .collapsible:hover {background-color: #555;}.collapsible:after {content: "\002B";color: white;font-weight: bold;float: right;margin-left: 5px;}.active:after {content: "\2212";}.content {padding: 0 18px;max-height: 0;overflow: hidden;transition: max-height 0.2s ease-out;background-color: #f1f1f1;}</style>'
