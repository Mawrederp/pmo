// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('General Pricing', {
	refresh: function (frm) {

	},
	// project_q: function (frm, cdt, cdn) {
		
 //            // child.status = "Accepted"
	// 	// console.log(frm.doc.project);
	// 	// getchildtable(frm.doc.project,"Development Services");
	// 	// var newrow = frappe.model.add_child(cur_frm.doc, "project_quotation_table", "project_quotation_table");
	// 	// newrow.cost_items = "Hello";

	// 	// frm.refresh_fields();

	// }
	project: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		console.log(frm.doc.project);
		getchildtable(frm.doc.project,"Development Services");
		var newrow = frappe.model.add_child(cur_frm.doc, "project_quotation_table", "project_quotation_table");
		var mm = frappe.model.set_value("General Pricing Table","project_quotation_table", "cost_items", "mmmm");
		console.log(mm);
		// newrow.total_cost_price =d.total_cost_price;
		// newrow.selling_price = 12;
		// newrow.markup = 12;
		// newrow.profit_amount = 12;
		// newrow.margin = 12;

		frm.refresh_fields();

	}
	
});


function getchildtable(parent,name) {
	frappe.call({
		method: "frappe.client.get_list",
		args: {
			doctype: name,
			fields: "cost_price",
			filters: [
				["parent", "=", parent]
			],
		},
		callback: function (res) {
			console.log(res)
		}
	});

}