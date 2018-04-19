// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

function getTotalOfField(myfield, mytotalfield, mychildtable, frm) {
	var total_price = 0;
	$.each(mychildtable || [], function (i, d) {
		total_price += flt(d[myfield]) || 0;
	});
	frm.set_value(mytotalfield, total_price.toFixed(2));
}

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

function calculateTechnicalServices(frm, cdt, cdn) {
	var child = locals[cdt][cdn];
	getOverheadExpenses(child);
	getTotal(child);
	getSellingPrice(child);
	getProfit(child);
	getMargin(child);
	getTotalOfField('total_cost_price', "total_cost_price_pmts", frm.doc.project_management_and_technical_services, frm);
	getTotalOfField('selling_price', "total_selling_price_pmts", frm.doc.project_management_and_technical_services, frm);
	getTotalOfField('profit', "total_profit_pmts", frm.doc.project_management_and_technical_services, frm);

	frm.refresh_fields();

}
frappe.ui.form.on('Project Management and Technical Services', {
	refresh: function (frm) {

	},
	cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn);
	},
	months: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn);

	},
	quantity: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn);

	},
	total_cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn);

	},
	markup: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn);

	},
	employee: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (!d.designation & d.employee != "") {
			frappe.model.set_value(cdt, cdn, "employee", "");
			frappe.throw('Please Specify Designation');

		}
		frappe.call({
			method: "pmo.project_services.doctype.project_quotation.project_quotation.get_basic_salary",
			args: {
				employee: d.employee
			},
			callback: function (data) {
				frappe.model.set_value(cdt, cdn, "cost_price", data.message);
			}
		});

	},
	designation: function (frm, cdt, cdn) {
		frappe.model.set_value(cdt, cdn, "employee", "");
	},
	total_cost_price: function (frm, cdt, cdn) {

	}




});


frappe.ui.form.on('Project Quotation', {
	refresh: function (frm) {

	},
	total_profit: function (frm) {
		if (cur_frm.doc.total_profit && cur_frm.doc.total_cost_price) {
			var totals = 0;
			totals = flt(cur_frm.doc.total_profit) / flt(cur_frm.doc.total_cost_price) * 100
			frm.set_value("total_markup", totals.toFixed(2))
		}
		if (cur_frm.doc.total_profit && cur_frm.doc.total_selling_price) {
			var totals_margin = 0;
			totals_margin = flt(cur_frm.doc.total_profit) / flt(cur_frm.doc.total_selling_price) * 100
			frm.set_value("total_margin", totals_margin.toFixed(2))
		}

	},
	total_cost_price: function (frm) {
		if (cur_frm.doc.total_profit && cur_frm.doc.total_cost_price) {
			var totals = 0;
			totals = flt(cur_frm.doc.total_profit) / flt(cur_frm.doc.total_cost_price) * 100
			console.log(totals);
			frm.set_value("total_markup", totals.toFixed(2))
		}

	},
	total_selling_price: function (frm) {
		if (cur_frm.doc.total_profit && cur_frm.doc.total_selling_price) {
			var totals_margin = 0;
			totals_margin = flt(cur_frm.doc.total_profit) / flt(cur_frm.doc.total_selling_price) * 100
			frm.set_value("total_margin", totals_margin.toFixed(2))
		}

	},
	total_profit_pmts: function (frm) {
		if (cur_frm.doc.total_profit_pmts && cur_frm.doc.total_cost_price_pmts) {
			var totals = 0;
			totals = flt(cur_frm.doc.total_profit_pmts) / flt(cur_frm.doc.total_cost_price_pmts) * 100
			frm.set_value("total_markup_pmts", totals.toFixed(2))
		}
		if (cur_frm.doc.total_profit_pmts && cur_frm.doc.total_selling_price_pmts) {
			var totals_margin = 0;
			totals_margin_pmts = flt(cur_frm.doc.total_profit_pmts) / flt(cur_frm.doc.total_selling_price_pmts) * 100
			frm.set_value("total_margin_pmts", totals_margin_pmts.toFixed(2))
		}

	},
	total_cost_price_pmts: function (frm) {
		if (cur_frm.doc.total_profit_pmts && cur_frm.doc.total_cost_price_pmts) {
			var totals = 0;
			totals = flt(cur_frm.doc.total_profit_pmts) / flt(cur_frm.doc.total_cost_price_pmts) * 100
			console.log(totals);
			frm.set_value("total_markup_pmts", totals.toFixed(2))
		}

	},
	total_selling_price_pmts: function (frm) {
		if (cur_frm.doc.total_profit_pmts && cur_frm.doc.total_selling_price_pmts) {
			var totals_margin = 0;
			totals_margin = flt(cur_frm.doc.total_profit_pmts) / flt(cur_frm.doc.total_selling_price_pmts) * 100
			frm.set_value("total_margin_pmts", totals_margin.toFixed(2))
		}

	}



});



cur_frm.set_query("items_develop", "development_services", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code_develop]
		]
	}
});



frappe.ui.form.on('Development Services', {
	currency_develop: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency_develop == 'SAR' && row.cost_price_develop) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price_develop", row.cost_price_develop);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price_develop", row.cost_price_develop * 3.75);
		}

	},
	cost_price_develop: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency_develop == 'SAR' && row.cost_price_develop) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price_develop", row.cost_price_develop);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price_develop", row.cost_price_develop * 3.75);
		}
		if (row.total_cost_price_develop && row.markup_develop) {
			frappe.model.set_value(cdt, cdn, "selling_price_develop", row.total_cost_price_develop + (row.total_cost_price_develop * (row.markup_develop / 100)));

		}
		if (row.selling_price_develop && row.total_cost_price_develop) {
			frappe.model.set_value(cdt, cdn, "profit_develop", row.selling_price_develop - row.total_cost_price_develop);

		}
		// getTotalOfField("total_cost_price_develop", "total_cost_price", frm.doc.development_services, frm);

	},
	total_cost_price_develop: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.total_cost_price_develop && row.markup_develop) {
			frappe.model.set_value(cdt, cdn, "selling_price_develop", row.total_cost_price_develop + (row.total_cost_price_develop * (row.markup_develop / 100)));

		}
		if (row.selling_price_develop && row.total_cost_price_develop) {
			frappe.model.set_value(cdt, cdn, "profit_develop", row.selling_price_develop - row.total_cost_price_develop);

		}
		getTotalOfField("total_cost_price_develop", "total_cost_price", frm.doc.development_services, frm);


	},
	markup_develop: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.total_cost_price_develop && row.markup_develop) {
			frappe.model.set_value(cdt, cdn, "selling_price_develop", row.total_cost_price_develop + (row.total_cost_price_develop * (row.markup_develop / 100)));

		}
		if (row.profit_develop && row.markup_develop) {
			frappe.model.set_value(cdt, cdn, "margin_develop", (row.profit_develop / row.selling_price_develop) * 100);

		}
		if (row.selling_price_develop && row.total_cost_price_develop) {
			frappe.model.set_value(cdt, cdn, "profit_develop", row.selling_price_develop - row.total_cost_price_develop);

		}

	},
	quantity_develop: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.quantity_develop && row.sar_cost_price_develop) {
			frappe.model.set_value(cdt, cdn, "total_cost_price_develop",row.quantity_develop * row.sar_cost_price_develop);

		}
		getTotalOfField("total_cost_price_develop", "total_cost_price", frm.doc.development_services, frm);

	},
	sar_cost_price_develop: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.quantity_develop && row.sar_cost_price_develop) {
			frappe.model.set_value(cdt, cdn, "total_cost_price_develop",row.quantity_develop * row.sar_cost_price_develop);

		}

	},

	profit_develop: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.profit_develop && row.markup_develop) {
			frappe.model.set_value(cdt, cdn, "margin_develop", 100 * (row.profit_develop / row.selling_price_develop));

		}
		getTotalOfField("profit_develop", "total_profit", frm.doc.development_services, frm);

	},
	selling_price_develop: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.selling_price_develop && row.total_cost_price_develop) {
			frappe.model.set_value(cdt, cdn, "profit_develop", row.selling_price_develop - row.total_cost_price_develop);

		}

	},
	selling_price_develop: function (frm, cdt, cdn) {
		getTotalOfField("selling_price_develop", "total_selling_price", frm.doc.development_services, frm);
		
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

frappe.ui.form.on('Hardware', {
	cost_price:function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
		getSellingPrice(row);
		getProfit(row)
		getMargin(row);

		frm.refresh_fields();

	},
	currency:function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency_hw == 'SAR' && row.cost_price_hw) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price_hw", row.cost_price_hw);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price_hw", row.cost_price_hw * 3.75);
		}
	},
	total_cost_price:function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		getTotalOfField("total_cost_price", "total_cost_price_hw", frm.doc.hardware, frm);
		getSellingPrice(row);
		getProfit(row);

		frm.refresh_fields();

	},

	quantity: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.quantity && row.sar_cost_price) {
			frappe.model.set_value(cdt, cdn, "total_cost_price",row.quantity * row.sar_cost_price);

		}
		getSellingPrice(row);
		getProfit(row);
		getMargin(row);

		frm.refresh_fields();

	},
	markup: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		// getSellingPrice(child);
		getProfit(row);
		getMargin(row);
		frm.refresh_fields();
	},
	sar_cost_price: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.quantity && row.sar_cost_price) {
			frappe.model.set_value(cdt, cdn, "total_cost_price",row.quantity * row.sar_cost_price);

	    }
	}
});