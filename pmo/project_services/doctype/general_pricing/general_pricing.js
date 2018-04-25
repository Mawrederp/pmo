// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('General Pricing Table', {
	total_cost_price: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn]
		var list = ["Financing", "Commission Of (Sales & P Delivery)"];
		if (list.indexOf(row.items) > -1) {
			row.total_selling_price = Math.round(row.total_cost_price);
			frm.refresh_fields();
		}

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

function change_read_only_to(x, frm, doc) {
	console.log(frm.fields_dict.project_quotation.grid.grid_rows[doc.idx - 1].columns.items)

	for (var i = 0; i < frm.fields_dict.project_quotation.grid.grid_rows.length; i++) {
		console.log(frm.fields_dict.project_quotation.grid.grid_rows[i].columns.items.field)
		console.log("///////--------")
		console.log(doc.items)
		if (frm.fields_dict.project_quotation.grid.grid_rows[i].columns.items.field) {
			if (frm.fields_dict.project_quotation.grid.grid_rows[i].columns.items.field.value == doc.items) {
				frm.fields_dict.project_quotation.grid.grid_rows[i].columns.items.df.read_only = x;
				frm.fields_dict.project_quotation.grid.grid_rows[i].columns.total_cost_price.df.read_only = x;
				frm.fields_dict.project_quotation.grid.grid_rows[i].columns.total_selling_price.df.read_only = x;
				frm.fields_dict.project_quotation.grid.grid_rows[i].columns.total_profit.df.read_only = x;
				frm.fields_dict.project_quotation.grid.grid_rows[i].columns.total_markup.df.read_only = x;
				frm.fields_dict.project_quotation.grid.grid_rows[i].columns.total_margin.df.read_only = x;
				break;
			}
		}

	}


}

function make_read_only(frm, cdt, cdn) {
	var row = locals[cdt][cdn];
	var current_doc = $('.data-row.editable-row').parent().attr("data-name");
	var doc = locals["General Pricing Table"][current_doc];
	var list = ["Risk & contingency", "Financing", "Commission Of (Sales & P Delivery)", "VAT"];
	console.log(doc.items)
	if (list.indexOf(doc.items) > -1) {
		console.log("---------------")
		change_read_only_to(0, frm, doc);
	} else {
		console.log("*********")
		change_read_only_to(1, frm, doc);
	}

	frm.refresh_fields()
	$(".small.form-clickable-section.grid-footer").hide();
	$("a.close.btn-open-row").hide()

}

frappe.ui.form.on('General Pricing', {
	refresh:function(){
		$(".small.form-clickable-section.grid-footer").hide();
		$("a.close.btn-open-row").hide()


	},
	onload_post_render: function (frm, cdt, cdn) {
		frm.fields_dict.project_quotation.grid.wrapper.on('mouseenter', 'div[data-fieldname="items"][title="items"]', function (e) {
			make_read_only(frm, cdt, cdn)

		});
		frm.fields_dict.project_quotation.grid.wrapper.on('mouseenter', 'div[data-fieldname="items"][title="items"]', function (e) {
			make_read_only(frm, cdt, cdn)
		});
		frm.fields_dict.project_quotation.grid.wrapper.on('mouseenter', 'div[data-fieldname="total_cost_price"][title="total_cost_price"]', function (e) {
			make_read_only(frm, cdt, cdn)
		});
		frm.fields_dict.project_quotation.grid.wrapper.on('mouseenter', 'div[data-fieldname="total_selling_price"][title="total_selling_price"]', function (e) {
			make_read_only(frm, cdt, cdn)
		});
		frm.fields_dict.project_quotation.grid.wrapper.on('mouseenter', 'div[data-fieldname="total_profit"][title="total_profit"]', function (e) {
			make_read_only(frm, cdt, cdn)
		});
		frm.fields_dict.project_quotation.grid.wrapper.on('mouseenter', 'div[data-fieldname="total_margin"][title="total_margin"]', function (e) {
			make_read_only(frm, cdt, cdn)
		});
		frm.fields_dict.project_quotation.grid.wrapper.on('mouseenter', 'div[data-fieldname="total_markup"][title="total_markup"]', function (e) {
			make_read_only(frm, cdt, cdn)
		});



	}
});