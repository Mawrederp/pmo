// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('General Pricing', {
	onload: function (frm) {
		$("#tableID th:last-child, #tableID td:last-child").remove();
		getTotalOfField('total_cost_price', "total_cost_price" , frm.doc.project_quotation, frm);
		getTotalOfField('total_selling_price', "selling_price" , frm.doc.project_quotation, frm);
		getTotalOfField('total_profit', "profit_amount" , frm.doc.project_quotation, frm);
		// getTotalOfField('total_markup', "total_markup" , frm.doc.project_quotation, frm);

		if (cur_frm.doc.profit_amount && cur_frm.doc.total_cost_price){
			var totals_markup = 0;
			totals_markup =  (flt(cur_frm.doc.profit_amount) / flt(cur_frm.doc.total_cost_price) )* 100;
			frm.set_value("total_markup" ,totals_markup.toFixed(2));
			
			
		}
		var total =0 
		for (var i = 0; i < cur_frm.doc.project_quotation.length; i++) {
			// console.log(cur_frm.doc.project_quotation[i].total_cost_price)
			if (cur_frm.doc.project_quotation[i].items == 'Financing' || cur_frm.doc.project_quotation[i].items =='Risk & contingency'){
				total += cur_frm.doc.project_quotation[i].total_cost_price ;
			}
		}
		var amount = flt(total) + flt(cur_frm.doc.profit_amount);
		frm.set_value("profit_amount_risk" ,amount);

		if (cur_frm.doc.profit_amount && cur_frm.doc.selling_price){
			var totals_margin = 0;
			totals_margin =  (flt(cur_frm.doc.profit_amount) / flt(cur_frm.doc.selling_price) )* 100;
			frm.set_value("total_margin" ,totals_margin.toFixed(2));
			
			
		}
		if (cur_frm.doc.profit_amount_risk && cur_frm.doc.selling_price){
			var totals_margin = 0;
			totals_margin =  (flt(cur_frm.doc.profit_amount_risk) / flt(cur_frm.doc.selling_price) )* 100;
			frm.set_value("total_margin_risk" ,totals_margin.toFixed(2));
			
			
		}

		if (cur_frm.doc.profit_amount_risk && cur_frm.doc.total_cost_price){
			var totals = 0;
			totals =  (flt(cur_frm.doc.profit_amount_risk) / flt(cur_frm.doc.total_cost_price) )* 100;
			frm.set_value("total_markup_risk" ,totals.toFixed(2));
		}
		
		

		// total_margin= total + cur_frm.doc.profit_amount
		// frm.set_value("total_margin_risk" ,total_margin);
	}

	
	// project_q: function (frm, cdt, cdn) {
		
 //            // child.status = "Accepted"
	// 	// console.log(frm.doc.project);
	// 	// getchildtable(frm.doc.project,"Development Services");
	// 	// var newrow = frappe.model.add_child(cur_frm.doc, "project_quotation_table", "project_quotation_table");
	// 	// newrow.cost_items = "Hello";

	// 	// frm.refresh_fields();

	// }
	// project: function (frm, cdt, cdn) {
	// 	var d = locals[cdt][cdn];
	// 	console.log(frm.doc.project);
	// 	getchildtable(frm.doc.project,"Development Services");
	// 	var newrow = frappe.model.add_child(cur_frm.doc, "project_quotation_table", "project_quotation_table");
	// 	var mm = frappe.model.set_value("General Pricing Table","project_quotation_table", "cost_items", "mmmm");
	// 	console.log(mm);
	// 	// newrow.total_cost_price =d.total_cost_price;
	// 	// newrow.selling_price = 12;
	// 	// newrow.markup = 12;
	// 	// newrow.profit_amount = 12;
	// 	// newrow.margin = 12;

	// 	frm.refresh_fields();

	// }
	
});


// frappe.ui.form.on("General Pricing Table", {
// 	// total_cost_price : function (frm, cdt, cdn) {
// 	// 	getTotalOfField('total_cost_price', "total_cost_price" , frm.doc.project_quotation, frm);

// 	// },
// 	// total_selling_price : function (frm, cdt, cdn) {
// 	// 	getTotalOfField('total_selling_price', "selling_price" + string, doc, frm);

// 	// }
	
// });

// function getchildtable(parent,name) {
// 	frappe.call({
// 		method: "frappe.client.get_list",
// 		args: {
// 			doctype: name,
// 			fields: "cost_price",
// 			filters: [
// 				["parent", "=", parent]
// 			],
// 		},
// 		callback: function (res) {
// 			console.log(res)
// 		}
// 	});

// }

function getTotalOfField(myfield, mytotalfield, mychildtable, frm) {
	var total_price = 0;
	$.each(mychildtable || [], function (i, d) {
		total_price += flt(d[myfield]) || 0;
	});
	frm.set_value(mytotalfield, total_price.toFixed(2));
}