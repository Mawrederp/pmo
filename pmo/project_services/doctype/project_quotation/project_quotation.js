// Copyright (c) 2018, s and contributors
// For license information, please see license.txt
function getTotal(child) {
	child.total_cost_price = ((child.cost_price * (1 + (child.overhead_value / 100)))) * (child.months) * (child.quantity / 100);
}

function getSellingPrice(child) {
	child.selling_price = child.total_cost_price + (child.total_cost_price * (child.markup / 100));

}

function getProfit(child) {
	child.profit = child.selling_price - child.total_cost_price;

}

function getMargin(child) {
	child.margin = (child.profit / child.selling_price) * 100;

}

function getOverheadExpenses(child) {
	child.overhead_expenses = (child.quantity / 100) * child.months;
}

function calculateTechnicalServices(frm, cdn, cdt) {
	var child = locals[cdn][cdt];
	getOverheadExpenses(child);
	getTotal(child);
	getSellingPrice(child);
	getProfit(child);
	getMargin(child);
	frm.refresh_fields();

}
frappe.ui.form.on('Project Management and Technical Services', {
	refresh: function (frm) {

	},
	cost_price: function (frm, cdn, cdt) {
		calculateTechnicalServices(frm, cdn, cdt);

	},
	months: function (frm, cdn, cdt) {
		calculateTechnicalServices(frm, cdn, cdt);

	},
	quantity: function (frm, cdn, cdt) {
		calculateTechnicalServices(frm, cdn, cdt);

	},
	total_cost_price: function (frm, cdn, cdt) {
		calculateTechnicalServices(frm, cdn, cdt);

	},
	markup: function (frm, cdn, cdt) {
		calculateTechnicalServices(frm, cdn, cdt);

	},
	employee: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (!d.designation) {
			d.employee = undefined;
			frm.refresh_fields();
			frappe.throw('Please Specify Designation');

		}
		
	}




});


frappe.ui.form.on('Project Quotation', {
	refresh: function (frm) {

	}
});

cur_frm.set_query("employee", 'project_management_and_technical_services', function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	console.log(d);
	return {
		"filters": {
			"designation": d.designation
		}
	}
});