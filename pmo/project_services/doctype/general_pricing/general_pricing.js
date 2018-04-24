// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('General Pricing', {
	on_load: function (frm) {
		$("#tableID th:last-child, #tableID td:last-child").remove();

	},
	project: function (frm, cdt, cdn) {
		console.log(frm.doc.project);
		getchildtable(frm.doc.project,"Development Services");
		var newrow = frappe.model.add_child(cur_frm.doc, "project_quotation", "project_quotation");
		newrow.cost_items = "Hello";

		frm.refresh_fields();

	},
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