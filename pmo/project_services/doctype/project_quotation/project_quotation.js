// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

var first_time = false

frappe.ui.form.on('Project Quotation', {

});

function getRiskSellingTotals(frm, string, doc) {
	var list = ["_pmts", "_develop", "_hw", "_sw", "_manpower", "_support", "_training", "_expenses"];
	var risk_sell_total = 0;
	list.forEach(element => {
		var x = 0
		console.log()

		if (flt(cur_frm.doc["total_cost_price" + element])) {
			risk_sell_total += flt(cur_frm.doc["total_cost_price" + element]);

		}


	});
	risk_sell_total *= 0.01;

	cur_frm.set_value("total_cost_price_risk_contingency", risk_sell_total.toFixed(2));
	cur_frm.set_value("total_selling_price_risk_contingency", Math.round(risk_sell_total).toFixed(2));
}

function getFinalTotals(frm, string, doc) {
	getTotalOfField('total_cost_price', "total_cost_price" + string, doc, frm);
	getTotalOfField('selling_price', "total_selling_price" + string, doc, frm);
	getTotalOfField('profit', "total_profit" + string, doc, frm);

	if (cur_frm.doc["total_profit" + string] > 0 && cur_frm.doc["total_cost_price" + string] > 0) {
		var totals = 0;
		totals = flt(cur_frm.doc["total_profit" + string]) / flt(cur_frm.doc["total_cost_price" + string]) * 100;
		frm.set_value("total_markup" + string, totals.toFixed(2));
	} else {
		frm.set_value("total_markup" + string, 0);
	}
	if (cur_frm.doc["total_profit" + string] > 0 && cur_frm.doc["total_selling_price" + string] > 0) {
		var totals_margin = 0;
		totals_margin = flt(cur_frm.doc["total_profit" + string]) / flt(cur_frm.doc["total_selling_price" + string]) * 100;
		frm.set_value("total_margin" + string, totals_margin.toFixed(2));
	} else {
		frm.set_value("total_margin" + string, 0);
	}


}

function get_item_price(frm, cdt, cdn, item, field) {
	var child = locals[cdt][cdn];
	if (!child.group_code && child.items != "" && child.items != undefined) {
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
				if (data.message) {
					frappe.model.set_value(cdt, cdn, field, data.message[0].price_list_rate);
					if (data.message[0].currency == "USD") {
						frappe.model.set_value(cdt, cdn, "currency", "USD");
					} else {
						frappe.model.set_value(cdt, cdn, "currency", "SAR");
					}

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

function getTotal(child, string) {
	if (string == "_support") {
		child.total_cost_price = child.sar_cost_price * (child.months) * (child.quantity);
	} else if (string == "_expenses") {
		child.total_cost_price = child.cost_price * (child.quantity);
	} else if (string == "_pmts") {
		child.total_cost_price = ((child.cost_price * (1 + (child.overhead_value / 100)))) * (child.months) * (child.quantity / 100);
	} else if (string == "_manpower") {
		child.total_cost_price = ((child.cost_price * (1 + (child.overhead_value / 100)))) * (child.months) * (child.quantity);
	} else {
		child.total_cost_price = child.sar_cost_price * (child.quantity);

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
	if (isNaN(child.margin)) {
		child.margin = 0;
	}

}

function getOverheadExpenses(child) {
	child.overhead_expenses = (child.quantity) * child.months;
}

function calculateTechnicalServices(frm, cdt, cdn, string, doc) {
	var child = locals[cdt][cdn];
	getOverheadExpenses(child);
	getTotal(child, string);
	getSellingPrice(child);
	getProfit(child);
	getMargin(child);
	getFinalTotals(frm, string, doc);
	frm.refresh_fields();
	getRiskSellingTotals(frm, string, doc)



}
frappe.ui.form.on('Project Management and Technical Services', {
	project_management_and_technical_services_remove: function (frm) {
		getFinalTotals(frm, "_pmts", frm.doc.project_management_and_technical_services);
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
	overhead_value: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);
	},
	employee: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.designation && d.employee != "" && d.employee != undefined) {
			frappe.call({
				method: "pmo.project_services.doctype.project_quotation.project_quotation.get_basic_salary",
				args: {
					employee: d.employee
				},
				callback: function (data) {
					frappe.model.set_value(cdt, cdn, "cost_price", data.message);
				}
			});
			calculateTechnicalServices(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);

		} else if (!d.designation && d.employee != "" && d.employee != undefined) {
			frappe.model.set_value(cdt, cdn, "employee", "");
			frappe.throw('Please Specify A Designation');


		}


	},
	designation: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		// if (d.designation == "" || d.designation == undefined) {
		frappe.model.set_value(cdt, cdn, "employee", "");

		// }
		calculateTechnicalServices(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);
	}
});

cur_frm.set_query("employee", 'project_management_and_technical_services', function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		"filters": {
			"designation": d.designation
		}
	}
});



cur_frm.set_query("items", "development_services", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});


frappe.ui.form.on('Development Services', {
	development_services_remove: function (frm) {
		getFinalTotals(frm, "_develop", frm.doc.development_services);
	},
	cost_price: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
		calculateTechnicalServices(frm, cdt, cdn, "_develop", frm.doc.development_services);

	},
	quantity: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_develop", frm.doc.development_services);

	},
	total_cost_price: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_develop", frm.doc.development_services);

	},
	markup: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_develop", frm.doc.development_services);

	},
	items: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.development_services);
		calculateTechnicalServices(frm, cdt, cdn, "_develop", frm.doc.development_services);


	},
	group_code: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.group_code && d.group_code != "" && d.group_code != undefined) {
			frappe.model.set_value(cdt, cdn, "items", "");

		}
		calculateTechnicalServices(frm, cdt, cdn, "_develop", frm.doc.development_services);
	},
	currency: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
		calculateTechnicalServices(frm, cdt, cdn, "_develop", frm.doc.development_services);
	}

});


frappe.ui.form.on('Hardware', {
	hardware_remove: function (frm) {
		getFinalTotals(frm, "_hw", frm.doc.hardware);
	},
	cost_price: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
		calculateTechnicalServices(frm, cdt, cdn, "_hw", frm.doc.hardware);

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
		var row = locals[cdt][cdn];
		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.hardware);
		calculateTechnicalServices(frm, cdt, cdn, "_hw", frm.doc.hardware);


	},
	group_code: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.group_code && d.group_code != "" && d.group_code != undefined) {
			frappe.model.set_value(cdt, cdn, "items", "");

		}
		calculateTechnicalServices(frm, cdt, cdn, "_hw", frm.doc.hardware);
	},
	currency: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
		calculateTechnicalServices(frm, cdt, cdn, "_hw", frm.doc.hardware);
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
	software_remove: function (frm) {
		getFinalTotals(frm, "_sw", frm.doc.software);
	},
	cost_price: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
		calculateTechnicalServices(frm, cdt, cdn, "_sw", frm.doc.software);

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
		var row = locals[cdt][cdn];
		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.software);
		calculateTechnicalServices(frm, cdt, cdn, "_sw", frm.doc.software);


	},
	group_code: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.group_code && d.group_code != "" && d.group_code != undefined) {
			frappe.model.set_value(cdt, cdn, "items", "");

		}
		calculateTechnicalServices(frm, cdt, cdn, "_sw", frm.doc.software);
	},
	currency: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
		calculateTechnicalServices(frm, cdt, cdn, "_sw", frm.doc.software);
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
	man_power_remove: function (frm) {
		getFinalTotals(frm, "_manpower", frm.doc.man_power);
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
	overhead_value: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_manpower", frm.doc.man_power);
	},
	employee: function (frm, cdt, cdn) {
		// var d = locals[cdt][cdn];
		// if (!d.designation & d.employee != "") {
		// 	frappe.model.set_value(cdt, cdn, "employee", "");
		// 	frappe.throw('Please Specify A Designation');

		// }
		// frappe.call({
		// 	method: "pmo.project_services.doctype.project_quotation.project_quotation.get_basic_salary",
		// 	args: {
		// 		employee: d.employee
		// 	},
		// 	callback: function (data) {
		// 		frappe.model.set_value(cdt, cdn, "cost_price", data.message);
		// 	}
		// });
		// calculateTechnicalServices(frm, cdt, cdn, "_manpower", frm.doc.man_power);
	},
	designation: function (frm, cdt, cdn) {
		// var d = locals[cdt][cdn];
		// if (d.designation && d.designation != "" && d.designation != undefined) {
		// 	frappe.model.set_value(cdt, cdn, "employee", "");

		// }
		// calculateTechnicalServices(frm, cdt, cdn, "_manpower", frm.doc.man_power);
	}



});

cur_frm.set_query("employee", 'man_power', function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		"filters": {
			"designation": d.designation
		}
	}
});


frappe.ui.form.on('Support License Renew', {
	support_license_renew_remove: function (frm) {
		getFinalTotals(frm, "_support", frm.doc.support_license_renew);
	},
	months: function (frm, cdt, cdn) {
		calculateTechnicalServices(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

	},
	cost_price: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
		calculateTechnicalServices(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

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
		calculateTechnicalServices(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

	},
	group_code: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.group_code && d.group_code != "" && d.group_code != undefined) {
			frappe.model.set_value(cdt, cdn, "items", "");

		}
		calculateTechnicalServices(frm, cdt, cdn, "_support", frm.doc.support_license_renew);
	},
	currency: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
		calculateTechnicalServices(frm, cdt, cdn, "_support", frm.doc.support_license_renew);
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
	training_remove: function (frm) {
		getFinalTotals(frm, "_training", frm.doc.training);
	},
	cost_price: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
		calculateTechnicalServices(frm, cdt, cdn, "_training", frm.doc.training);

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
		calculateTechnicalServices(frm, cdt, cdn, "_training", frm.doc.training);
	},
	group_code: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.group_code && d.group_code != "" && d.group_code != undefined) {
			frappe.model.set_value(cdt, cdn, "items", "");

		}
		calculateTechnicalServices(frm, cdt, cdn, "_training", frm.doc.training);
	},
	currency: function (frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.currency == 'SAR' && row.cost_price) {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
		} else {
			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
		}
		calculateTechnicalServices(frm, cdt, cdn, "_training", frm.doc.training);
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
	expenses_remove: function (frm) {
		getFinalTotals(frm, "_expenses", frm.doc.expenses);
	},
	cost_price: function (frm, cdt, cdn) {
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
		var d = locals[cdt][cdn];
		if (d.group_code && d.group_code != "" && d.group_code != undefined) {
			frappe.model.set_value(cdt, cdn, "items", "");

		}
		calculateTechnicalServices(frm, cdt, cdn, "_expenses", frm.doc.expenses);
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