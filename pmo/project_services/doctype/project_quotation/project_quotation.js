// Copyright (c) 2018, s and contributors
// For license information, please see license.txt


function get_item_price(frm, cdt, cdn, item, field) {
	var child = locals[cdt][cdn];
	if (!child.group_code && child.items != "") {
		frappe.model.set_value(cdt, cdn, "items", "");
		frappe.throw('Please Specify A Group for the Item');
	}
	if (item) {
		frappe.call({
			method: "pmo.project_services.doctype.project_quotation.project_quotation.get_item_price",
			args: {
				item: item
			},
			callback: function (data) {
				console.log(data.message)
				if (data.message) {
					frappe.model.set_value(cdt, cdn, field, data.message[0].price_list_rate);
				} else {
					frappe.model.set_value(cdt, cdn, field, 0);
				}
			}
		});
	}

}

function getTotalOfField(myfield, mytotalfield, mychildtable, frm) {
	var total_price = 0;
	$.each(mychildtable || [], function (i, d) {
		total_price += flt(d[myfield]) || 0;
	});
	frm.set_value(mytotalfield, total_price.toFixed(2));
}

function getTotal(child) {
	if (child.sar_cost_price & child.months) {
		child.total_cost_price = child.sar_cost_price * (child.months) * (child.quantity / 100);
	} else if (child.sar_cost_price) {
		child.total_cost_price = child.sar_cost_price * (child.quantity / 100);
	} else if (child.months) {
		child.total_cost_price = ((child.cost_price * (1 + (child.overhead_value / 100)))) * (child.months) * (child.quantity / 100);
	} else {
		child.total_cost_price = child.cost_price * (child.quantity / 100);

	}

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

function calculateTechnicalServices(frm, cdt, cdn, string, doc) {
	var child = locals[cdt][cdn];
	getOverheadExpenses(child);
	getTotal(child);
	getSellingPrice(child);
	getProfit(child);
	getMargin(child);
	getTotalOfField('total_cost_price', "total_cost_price" + string, doc, frm);
	getTotalOfField('selling_price', "total_selling_price" + string, doc, frm);
	getTotalOfField('profit', "total_profit" + string, doc, frm);

	if (cur_frm.doc["total_profit" + string] && cur_frm.doc["total_cost_price" + string]) {
		var totals = 0;
		totals = flt(cur_frm.doc["total_profit" + string]) / flt(cur_frm.doc["total_cost_price" + string]) * 100
		frm.set_value("total_markup" + string, totals.toFixed(2))
	}
	if (cur_frm.doc["total_profit" + string] && cur_frm.doc["total_selling_price" + string]) {
		var totals_margin = 0;
		totals_margin = flt(cur_frm.doc["total_profit" + string]) / flt(cur_frm.doc["total_selling_price" + string]) * 100
		frm.set_value("total_margin" + string, totals_margin.toFixed(2))
	}
	frm.refresh_fields();

}
frappe.ui.form.on('Project Management and Technical Services', {
	refresh: function (frm) {

	},
	cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);
	},
	months: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);

	},
	quantity: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);

	},
	total_cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);

	},
	markup: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);

	},
	employee: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (!d.designation & d.employee != "") {
			frappe.model.set_value(cdt, cdn, "employee", "");
			frappe.throw('Please Specify A Designation');

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

cur_frm.set_query("employee", 'project_management_and_technical_services', function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	console.log(d);
	return {
		"filters": {
			"designation": d.designation
		}
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
			frappe.model.set_value(cdt, cdn, "total_cost_price_develop", row.quantity_develop * row.sar_cost_price_develop);

		}
		getTotalOfField("total_cost_price_develop", "total_cost_price", frm.doc.development_services, frm);

	},
	sar_cost_price_develop: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.quantity_develop && row.sar_cost_price_develop) {
			frappe.model.set_value(cdt, cdn, "total_cost_price_develop", row.quantity_develop * row.sar_cost_price_develop);

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
	},
	items_develop: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		get_item_price(frm, cdt, cdn, row.items_develop, "cost_price_develop");
	}






});


frappe.ui.form.on('Hardware', {
	refresh: function (frm) {

	},
	cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_hw", frm.doc.hardware);
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
	},
	quantity: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_hw", frm.doc.hardware);

	},
	total_cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_hw", frm.doc.hardware);

	},
	markup: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_hw", frm.doc.hardware);

	},
	items: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_sw", frm.doc.software);
		var row = locals[cdt][cdn];
		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.hardware);

	},
	group_code: function (frm, cdt, cdn) {
		frappe.model.set_value(cdt, cdn, "items", "");
	},
	currency: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
	}

});


cur_frm.set_query("items", "hardware", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});


frappe.ui.form.on('Software', {
	refresh: function (frm) {

	},
	cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_sw", frm.doc.software);
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
	},
	quantity: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_sw", frm.doc.software);

	},
	total_cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_sw", frm.doc.software);

	},
	markup: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_sw", frm.doc.software);

	},
	items: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_sw", frm.doc.software);
		var row = locals[cdt][cdn];
		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.software);

	},
	group_code: function (frm, cdt, cdn) {
		frappe.model.set_value(cdt, cdn, "items", "");
	},
	currency: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
	}

});


cur_frm.set_query("items", "software", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});


frappe.ui.form.on('Man Power', {
	refresh: function (frm) {

	},
	cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_manpower", frm.doc.man_power);

	},
	months: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_manpower", frm.doc.man_power);

	},
	quantity: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_manpower", frm.doc.man_power);

	},
	total_cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_manpower", frm.doc.man_power);

	},
	markup: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_manpower", frm.doc.man_power);

	},
	employee: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (!d.designation & d.employee != "") {
			frappe.model.set_value(cdt, cdn, "employee", "");
			frappe.throw('Please Specify A Designation');

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
	}



});

cur_frm.set_query("employee", 'man_power', function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	console.log(d);
	return {
		"filters": {
			"designation": d.designation
		}
	}
});


frappe.ui.form.on('Support License Renew', {
	refresh: function (frm) {

	},
	cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_support", frm.doc.support_license_renew);
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
	},
	quantity: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

	},
	total_cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

	},
	markup: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

	},
	items: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.support_license_renew);

	},
	group_code: function (frm, cdt, cdn) {
		frappe.model.set_value(cdt, cdn, "items", "");
	},
	currency: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
	}

});

cur_frm.set_query("items", "support_license_renew", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});



frappe.ui.form.on('Training', {
	refresh: function (frm) {

	},
	cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_training", frm.doc.training);
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
	},
	quantity: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_training", frm.doc.training);

	},
	total_cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_training", frm.doc.training);

	},
	markup: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_training", frm.doc.training);

	},
	items: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.training);

	},
	group_code: function (frm, cdt, cdn) {
		frappe.model.set_value(cdt, cdn, "items", "");
	},
	currency: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
	}

});

cur_frm.set_query("items", "training", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});

frappe.ui.form.on('Expenses', {
	refresh: function (frm) {

	},
	cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_expenses", frm.doc.expenses);
	},
	months: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_expenses", frm.doc.expenses);

	},
	quantity: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_expenses", frm.doc.expenses);

	},
	total_cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_expenses", frm.doc.expenses);

	},
	markup: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_expenses", frm.doc.expenses);

	},
	items: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.expenses);

	},
	group_code: function (frm, cdt, cdn) {
		frappe.model.set_value(cdt, cdn, "items", "");
	},



});

cur_frm.set_query("items", "expenses", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});