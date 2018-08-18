// Copyright (c) 2018, s and contributors
// For license information, please see license.txt




frappe.ui.form.on('Project Quotation', {
	profit_0: function (frm) {
		var markup_0 = cur_frm.doc.profit_0 / (cur_frm.doc.cost_0 + cur_frm.doc.risk_contingency_0)
		var margin_0 = cur_frm.doc.profit_0 / cur_frm.doc.total_selling_price_0
		cur_frm.set_value("markup_0", (markup_0 ));
		cur_frm.set_value("margin_0", (margin_0 ));
	},
	profit_1: function (frm) {
		var markup_1 = cur_frm.doc.profit_1 / (cur_frm.doc.cost_1 + cur_frm.doc.risk_contingency_1)
		var margin_1 = cur_frm.doc.profit_1 / cur_frm.doc.total_selling_price_1
		cur_frm.set_value("markup_1", (markup_1 ));
		cur_frm.set_value("margin_1", (margin_1 ));
	},
	profit_2: function (frm) {
		var markup_2 = cur_frm.doc.profit_2 / (cur_frm.doc.cost_2 + cur_frm.doc.risk_contingency_2)
		var margin_2 = cur_frm.doc.profit_2 / cur_frm.doc.total_selling_price_2
		cur_frm.set_value("markup_2", (markup_2 ));
		cur_frm.set_value("margin_2", (margin_2 ));
	},
	profit_3: function (frm) {
		var markup_3 = cur_frm.doc.profit_3 / (cur_frm.doc.cost_3 + cur_frm.doc.risk_contingency_3)
		var margin_3 = cur_frm.doc.profit_3 / cur_frm.doc.total_selling_price_3
		cur_frm.set_value("markup_3", (markup_3 ));
		cur_frm.set_value("margin_3", (margin_3 ));
	},
	profit_4: function (frm) {
		var markup_4 = cur_frm.doc.profit_4 / (cur_frm.doc.cost_4 + cur_frm.doc.risk_contingency_4)
		var margin_4 = cur_frm.doc.profit_4 / cur_frm.doc.total_selling_price_4
		cur_frm.set_value("markup_4", (markup_4 ));
		cur_frm.set_value("margin_4", (margin_4 ));
	},
	profit_5: function (frm) {
		var markup_5 = cur_frm.doc.profit_5 / (cur_frm.doc.cost_5 + cur_frm.doc.risk_contingency_5)
		var margin_5 = cur_frm.doc.profit_5 / cur_frm.doc.total_selling_price_5
		cur_frm.set_value("markup_5", (markup_5 ));
		cur_frm.set_value("margin_5", (margin_5 ));
	},
	profit_6: function (frm) {
		var markup_6 = cur_frm.doc.profit_6 / (cur_frm.doc.cost_6 + cur_frm.doc.risk_contingency_6)
		var margin_6 = cur_frm.doc.profit_6 / cur_frm.doc.total_selling_price_6
		cur_frm.set_value("markup_6", (markup_6 ));
		cur_frm.set_value("margin_6", (margin_6 ));
	},
	profit_7: function (frm) {
		var markup_7 = cur_frm.doc.profit_7 / (cur_frm.doc.cost_7 + cur_frm.doc.risk_contingency_7)
		var margin_7 = cur_frm.doc.profit_7 / cur_frm.doc.total_selling_price_7
		cur_frm.set_value("markup_7", (markup_7 ));
		cur_frm.set_value("margin_7", (margin_7 ));
	},
	profit_8: function (frm) {
		var markup_8 = cur_frm.doc.profit_8 / (cur_frm.doc.cost_8 + cur_frm.doc.risk_contingency_8)
		var margin_8 = cur_frm.doc.profit_8 / cur_frm.doc.total_selling_price_8
		cur_frm.set_value("markup_8", (markup_8 ));
		cur_frm.set_value("margin_8", (margin_8 ));
	},
	profit_9: function (frm) {
		var markup_9 = cur_frm.doc.profit_9 / (cur_frm.doc.cost_9 + cur_frm.doc.risk_contingency_9)
		var margin_9 = cur_frm.doc.profit_9 / cur_frm.doc.total_selling_price_9
		cur_frm.set_value("markup_9", (markup_9 ));
		cur_frm.set_value("margin_9", (margin_9 ));
	},
	profit_10: function (frm) {
		var markup_10 = cur_frm.doc.profit_10 / (cur_frm.doc.cost_10 + cur_frm.doc.risk_contingency_10)
		var margin_10 = cur_frm.doc.profit_10 / cur_frm.doc.total_selling_price_10
		cur_frm.set_value("markup_10", (markup_10 ));
		cur_frm.set_value("margin_10", (margin_10 ));
	},
	profit_11: function (frm) {
		var markup_11 = cur_frm.doc.profit_11 / (cur_frm.doc.cost_11 + cur_frm.doc.risk_contingency_11)
		var margin_11 = cur_frm.doc.profit_11 / cur_frm.doc.total_selling_price_11
		cur_frm.set_value("markup_11", (markup_11 ));
		cur_frm.set_value("margin_11", (margin_11 ));
	},
	profit_12: function (frm) {
		var markup_12 = cur_frm.doc.profit_12 / (cur_frm.doc.cost_12 + cur_frm.doc.risk_contingency_12)
		var margin_12 = cur_frm.doc.profit_12 / cur_frm.doc.total_selling_price_12
		cur_frm.set_value("markup_12", (markup_12 ));
		cur_frm.set_value("margin_12", (margin_12 ));
	},
	profit_13: function (frm) {
		var markup_13 = cur_frm.doc.profit_13 / (cur_frm.doc.cost_13 + cur_frm.doc.risk_contingency_13)
		var margin_13 = cur_frm.doc.profit_13 / cur_frm.doc.total_selling_price_13
		cur_frm.set_value("markup_13", (markup_13 ));
		cur_frm.set_value("margin_13", (margin_13 ));
	},
	profit_14: function (frm) {
		var markup_14 = cur_frm.doc.profit_14 / (cur_frm.doc.cost_14 + cur_frm.doc.risk_contingency_14)
		var margin_14 = cur_frm.doc.profit_14 / cur_frm.doc.total_selling_price_14
		cur_frm.set_value("markup_14", (markup_14 ));
		cur_frm.set_value("margin_14", (margin_14 ));
	},
	profit_15: function (frm) {
		var markup_15 = cur_frm.doc.profit_15 / (cur_frm.doc.cost_15 + cur_frm.doc.risk_contingency_15)
		var margin_15 = cur_frm.doc.profit_15 / cur_frm.doc.total_selling_price_15
		cur_frm.set_value("markup_15", (markup_15 ));
		cur_frm.set_value("margin_15", (margin_15 ));
	},


	validate: function (frm) {
		for (let index = 0; index <= 15; index++) {
			$.each(cur_frm.doc["items_details_" + index] || [], function (i, d) {
				frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc["total_overhead_expenses_" + index]);
			});

			var grand_total = 0;
			$.each(frm.doc["resources_details_" + index] || [], function (i, d) {
				grand_total += flt(d.overhead_expenses);
			});
			frm.set_value("total_overhead_expenses_" + index, grand_total);

			var grand_total = 0;
			$.each(frm.doc["items_details_" + index] || [], function (i, d) {
				grand_total += flt(d.total_cost);
			});
			frm.set_value("cost_" + index, grand_total);

			var grand_total = 0;
			$.each(frm.doc["items_details_" + index] || [], function (i, d) {
				grand_total += flt(d.selling_price);
			});
			frm.set_value("selling_price_" + index, grand_total);

			var grand_total = 0;
			$.each(frm.doc["items_details_" + index] || [], function (i, d) {
				grand_total += flt(d.contingency);
			});
			frm.set_value("risk_contingency_" + index, grand_total);

			var grand_total = 0;
			$.each(frm.doc["items_details_" + index] || [], function (i, d) {
				grand_total += flt(d.final_selling_price);
			});
			frm.set_value("total_selling_price_" + index, grand_total);

			var grand_total = 0;
			$.each(frm.doc["items_details_" + index] || [], function (i, d) {
				grand_total += flt(d.profit);
			});
			frm.set_value("profit_" + index, grand_total);
		}

	}

});

cur_frm.set_query("resources", "resources_details_0", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});


cur_frm.set_query("group_code", "resources_details_0", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});


cur_frm.cscript.total_overhead_expenses_0 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_0 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_0);
	});
}

frappe.ui.form.on('Resources Details', {
	cost_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.cost_price && d.quantity && d.months) {
			var total = ((d.cost_price * 1.45) * d.months) * d.quantity
			frappe.model.set_value(cdt, cdn, "overhead_expenses", total);
		}
	},
	quantity: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.cost_price && d.quantity && d.months) {
			var total = ((d.cost_price * 1.45) * d.months) * d.quantity
			frappe.model.set_value(cdt, cdn, "overhead_expenses", total);
		}
	},
	months: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.cost_price && d.quantity && d.months) {
			var total = ((d.cost_price * 1.45) * d.months) * d.quantity
			frappe.model.set_value(cdt, cdn, "overhead_expenses", total);
		}
	},
	group_code: function (frm, cdt, cdn) {
		frappe.model.set_value(cdt, cdn, "resources", "");
	}

});

frappe.ui.form.on("Resources Details", "overhead_expenses", function (frm, cdt, cdn) {

	for (let index = 0; index <= 15; index++) {
		var grand_total = 0;
		$.each(frm.doc["resources_details_" + index] || [], function (i, d) {
			grand_total += flt(d.overhead_expenses);
		});
		frm.set_value("total_overhead_expenses_" + index, grand_total);

	}


});





frappe.ui.form.on('Items Details', {
	cost_price: function (frm, cdt, cdn) {

		var d = locals[cdt][cdn];
		if (d.cost_price && d.currency == 'SAR') {
			var total = d.cost_price
		} else if (d.cost_price && d.currency == '$') {
			var total = d.cost_price * 3.75
		} else if (d.cost_price) {
			var total = 0
		}

		frappe.model.set_value(cdt, cdn, "sar_cost_price", total);

		for (let index = 0; index <= 15; index++) {
			if (frm.selected_doc.parentfield == "items_details_" + index) {
				if (cur_frm.doc["total_overhead_expenses_" + index]) {
					frappe.model.set_value(cdt, cdn, "tawaris_services", cur_frm.doc["total_overhead_expenses_" + index]);
				}
			}

		}

		frappe.model.set_value(cdt, cdn, "total_cost", d.total_cost_price + d.cost_price_ts);
		frappe.model.set_value(cdt, cdn, "contingency", (d.risk / 100) * d.total_cost);
		frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);



	},
	currency: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.cost_price && d.currency == 'SAR') {
			var total = d.cost_price
		} else if (d.cost_price && d.currency == '$') {
			var total = d.cost_price * 3.75
		} else {
			var total = 0
		}
		frappe.model.set_value(cdt, cdn, "total_cost", d.total_cost_price + d.cost_price_ts);
		frappe.model.set_value(cdt, cdn, "contingency", (d.risk / 100) * d.total_cost);
		frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
		frappe.model.set_value(cdt, cdn, "sar_cost_price", total);
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
	},
	sar_cost_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.sar_cost_price && d.quantity) {
			var total = d.sar_cost_price * d.quantity
			frappe.model.set_value(cdt, cdn, "cost_price_unit", total);
		}
	},
	quantity: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.sar_cost_price && d.quantity) {
			var total = d.sar_cost_price * d.quantity
			frappe.model.set_value(cdt, cdn, "cost_price_unit", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
		frappe.model.set_value(cdt, cdn, "total_cost", d.total_cost_price + d.cost_price_ts);
		frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
	},
	markup: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.markup) {
			frappe.model.set_value(cdt, cdn, "markup_follow", d.markup);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
		frappe.model.set_value(cdt, cdn, "total_cost", d.total_cost_price + d.cost_price_ts);
		frappe.model.set_value(cdt, cdn, "contingency", (d.risk / 100) * d.total_cost);
		frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
	},
	cost_price_unit: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.cost_price_unit && d.markup_follow) {
			var total = d.cost_price_unit + (d.cost_price_unit * (d.markup_follow / 100))
			frappe.model.set_value(cdt, cdn, "selling_price_unit", total);
		}
		if (d.cost_price_unit && d.time_unit) {
			var total = d.cost_price_unit * d.time_unit
			frappe.model.set_value(cdt, cdn, "total_cost_price", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
	},
	markup_follow: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.cost_price_unit && d.markup_follow) {
			var total = d.cost_price_unit + (d.cost_price_unit * (d.markup_follow / 100))
			frappe.model.set_value(cdt, cdn, "selling_price_unit", total);
		}
		if (d.cost_price_ts && d.markup_follow) {
			var total = d.cost_price_ts + (d.cost_price_ts * d.markup_follow)
			frappe.model.set_value(cdt, cdn, "selling_price_ts", total);
		}
		frappe.model.set_value(cdt, cdn, "total_cost", d.total_cost_price + d.cost_price_ts);
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
		frappe.model.set_value(cdt, cdn, "contingency", (d.risk / 100) * d.total_cost);
		frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
	},
	time_unit: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.cost_price_unit && d.time_unit) {
			var total = d.cost_price_unit * d.time_unit
			frappe.model.set_value(cdt, cdn, "total_cost_price", total);
		}
		if (d.selling_price_unit && d.time_unit) {
			var total = d.selling_price_unit * d.time_unit
			frappe.model.set_value(cdt, cdn, "total_selling_price", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
		frappe.model.set_value(cdt, cdn, "total_cost", d.total_cost_price + d.cost_price_ts);
		frappe.model.set_value(cdt, cdn, "contingency", (d.risk / 100) * d.total_cost);
		frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
	},
	selling_price_unit: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.selling_price_unit && d.time_unit) {
			var total = d.selling_price_unit * d.time_unit
			frappe.model.set_value(cdt, cdn, "total_selling_price", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
	},
	tawaris_services: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.tawaris_services && d.time_unit_services) {
			var total = d.tawaris_services * d.time_unit_services
			frappe.model.set_value(cdt, cdn, "cost_price_ts", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
	},
	time_unit_services: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "final_selling_price", 0);
		if (d.tawaris_services && d.time_unit_services) {
			var total = d.tawaris_services * d.time_unit_services
			frappe.model.set_value(cdt, cdn, "cost_price_ts", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
		frappe.model.set_value(cdt, cdn, "total_cost", d.total_cost_price + d.cost_price_ts);
		frappe.model.set_value(cdt, cdn, "contingency", (d.risk / 100) * d.total_cost);
		frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
	},
	cost_price_ts: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.cost_price_ts && d.markup_follow) {
			var total = d.cost_price_ts + (d.cost_price_ts * (d.markup_follow / 100))
			frappe.model.set_value(cdt, cdn, "selling_price_ts", total);
		}
		if (d.total_cost_price && d.cost_price_ts) {
			var total = d.total_cost_price + d.cost_price_ts
			frappe.model.set_value(cdt, cdn, "total_cost", total);
		}
		frappe.model.set_value(cdt, cdn, "total_cost", d.total_cost_price + d.cost_price_ts);
		frappe.model.set_value(cdt, cdn, "contingency", (d.risk / 100) * d.total_cost);
		frappe.model.set_value(cdt, cdn, "contingency", (d.risk / 100) * d.total_cost);
		frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
	},
	total_cost_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.total_cost_price && d.cost_price_ts) {
			var total = d.total_cost_price + d.cost_price_ts
			frappe.model.set_value(cdt, cdn, "total_cost", total);
		}
		frappe.model.set_value(cdt, cdn, "total_cost", d.total_cost_price + d.cost_price_ts);
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
	},
	total_selling_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.total_selling_price && d.selling_price_ts) {
			var total = d.total_selling_price + d.selling_price_ts
			frappe.model.set_value(cdt, cdn, "selling_price", total);
		}
		frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
	},
	selling_price_ts: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.total_selling_price && d.selling_price_ts) {
			var total = d.total_selling_price + d.selling_price_ts
			frappe.model.set_value(cdt, cdn, "selling_price", total);
		}
		frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
	},
	total_cost: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.total_cost && d.selling_price) {
			var total = d.selling_price - d.total_cost
			frappe.model.set_value(cdt, cdn, "profit", total);
		}
		if (d.total_cost) {
			var total = (d.risk / 100) * d.total_cost
			frappe.model.set_value(cdt, cdn, "contingency", total);
		}
	},
	selling_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.total_cost && d.selling_price) {
			var total = d.selling_price - d.total_cost
			frappe.model.set_value(cdt, cdn, "profit", total);
		}
		if (d.contingency && d.selling_price) {
			var total = d.contingency + d.selling_price
			frappe.model.set_value(cdt, cdn, "final_selling_price", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
	},
	risk: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "final_selling_price", 0);
		if (d.total_cost) {
			var total = (d.risk / 100) * d.total_cost
			frappe.model.set_value(cdt, cdn, "contingency", total);
		}
		frappe.model.set_value(cdt, cdn, "total_cost", d.total_cost_price + d.cost_price_ts);
		frappe.model.set_value(cdt, cdn, "contingency", (d.risk / 100) * d.total_cost);
		frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
		frappe.model.set_value(cdt, cdn, "contingency", (d.risk / 100) * d.total_cost);
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
	},
	contingency: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.contingency && d.selling_price) {
			var total = d.contingency + d.selling_price
			frappe.model.set_value(cdt, cdn, "final_selling_price", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
	},
	profit: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.profit && d.final_selling_price && !(d.final_selling_price == 0 || isNaN(d.final_selling_price))) {
			var total = Math.round((d.profit / d.final_selling_price) * 100)
			frappe.model.set_value(cdt, cdn, "margin", total);
		}
	},
	final_selling_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.profit && d.final_selling_price && !(d.final_selling_price == 0 || isNaN(d.final_selling_price))) {
			var total = Math.round((d.profit / d.final_selling_price) * 100)
			frappe.model.set_value(cdt, cdn, "margin", total);
		}
	},
	tawaris_services_percent: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];

		section_caracter = d.parentfield.slice(-1)
		defult_tawaris_services = cur_frm.doc["total_overhead_expenses_" + section_caracter]

		if (d.tawaris_services_check && d.tawaris_services_percent) {
			// var total = defult_tawaris_services - (defult_tawaris_services*d.tawaris_services_percent/100)
			var total = defult_tawaris_services*d.tawaris_services_percent/100
			frappe.model.set_value(cdt, cdn, "tawaris_services", total);
		}else if (d.tawaris_services_check && d.tawaris_services_percent==0) {
			var total = "0"
			frappe.model.set_value(cdt, cdn, "tawaris_services", total);
		}
	},
	tawaris_services_check: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		section_caracter = d.parentfield.slice(-1)
		defult_tawaris_services = cur_frm.doc["total_overhead_expenses_" + section_caracter]

		if(d.tawaris_services_check==0 && defult_tawaris_services){
			frappe.model.set_value(cdt, cdn, "tawaris_services", defult_tawaris_services);
		}

	},

});





frappe.ui.form.on("Items Details", "total_cost", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	for (let index = 0; index <= 15; index++) {
		var grand_total = 0;
		$.each(frm.doc["items_details_" + index] || [], function (i, d) {
			grand_total += flt(d.total_cost);
		});
		frm.set_value("cost_" + index, grand_total);
	}


});

frappe.ui.form.on("Items Details", "selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	for (let index = 0; index <= 15; index++) {
		var grand_total = 0;
		$.each(frm.doc["items_details_" + index] || [], function (i, d) {
			grand_total += flt(d.selling_price);
		});
		frm.set_value("selling_price_" + index, grand_total);
	}

});


frappe.ui.form.on("Items Details", "contingency", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	for (let index = 0; index <= 15; index++) {
		var grand_total = 0;
		$.each(frm.doc["items_details_" + index] || [], function (i, d) {
			grand_total += flt(d.contingency);
		});
		frm.set_value("risk_contingency_" + index, grand_total);
	}

});


frappe.ui.form.on("Items Details", "final_selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	for (let index = 0; index <= 15; index++) {
		var grand_total = 0;
		$.each(frm.doc["items_details_" + index] || [], function (i, d) {
			grand_total += flt(d.final_selling_price);
		});
		frm.set_value("total_selling_price_" + index, grand_total);
	}
	refresh_general_pricing(frm);

});



frappe.ui.form.on("Items Details", "profit", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	for (let index = 0; index <= 15; index++) {
		var grand_total = 0;
		$.each(frm.doc["items_details_" + index] || [], function (i, d) {
			grand_total += flt(d.profit);
		});
		frm.set_value("profit_" + index, grand_total);
	}

});




cur_frm.set_query("resources", "resources_details_1", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});

cur_frm.set_query("group_code", "resources_details_1", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});

cur_frm.cscript.total_overhead_expenses_1 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_1 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_1);
	});


}



cur_frm.set_query("resources", "resources_details_2", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_2", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_2 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_2 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_2);
	});


}


cur_frm.set_query("resources", "resources_details_3", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_3", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_3 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_3 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_3);
	});


}




cur_frm.set_query("resources", "resources_details_4", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_4", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_4 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_4 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_4);
	});


}





cur_frm.set_query("resources", "resources_details_5", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_5", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_5 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_5 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_5);
	});


}



cur_frm.set_query("resources", "resources_details_6", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_6", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_6 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_6 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_6);
	});


}



cur_frm.set_query("resources", "resources_details_7", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_7", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_7 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_7 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_7);
	});
}





cur_frm.set_query("resources", "resources_details_8", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_8", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_8 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_8 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_8);
	});


}

cur_frm.set_query("resources", "resources_details_9", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_9", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_9 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_9 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_9);
	});


}



cur_frm.set_query("resources", "resources_details_10", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_10", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_10 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_10 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_10);
	});


}



cur_frm.set_query("resources", "resources_details_11", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_11", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_11 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_11 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_11);
	});


}



cur_frm.set_query("resources", "resources_details_12", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_12", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_12 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_12 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_12);
	});


}




cur_frm.set_query("resources", "resources_details_13", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_13", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_13 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_13 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_13);
	});


}



cur_frm.set_query("resources", "resources_details_14", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_14", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_14 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_14 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_14);
	});


}
frappe.ui.form.on("Resources Details", "overhead_expenses", function (frm, cdt, cdn) {
	var grand_total = 0;
	$.each(frm.doc.resources_details_14 || [], function (i, d) {
		grand_total += flt(d.overhead_expenses);
	});
	frm.set_value("total_overhead_expenses_14", grand_total);
});
frappe.ui.form.on("Items Details", "total_cost", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_14 || [], function (i, d) {
		grand_total += flt(d.total_cost);
	});
	frm.set_value("cost_14", grand_total);
});

frappe.ui.form.on("Items Details", "selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_14 || [], function (i, d) {
		grand_total += flt(d.selling_price);
	});
	frm.set_value("selling_price_14", grand_total);
});

frappe.ui.form.on("Items Details", "contingency", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_14 || [], function (i, d) {
		grand_total += flt(d.contingency);
	});
	frm.set_value("risk_contingency_14", grand_total);
});
frappe.ui.form.on("Items Details", "final_selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_14 || [], function (i, d) {
		grand_total += flt(d.final_selling_price);
	});
	frm.set_value("total_selling_price_14", grand_total);
});
frappe.ui.form.on("Items Details", "profit", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_14 || [], function (i, d) {
		grand_total += flt(d.profit);
	});
	frm.set_value("profit_14", grand_total);
});




cur_frm.set_query("resources", "resources_details_15", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.set_query("group_code", "resources_details_15", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item Group', 'parent_item_group', '=', 'Project']
		]
	}
});
cur_frm.cscript.total_overhead_expenses_15 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_15 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_15);
	});


}