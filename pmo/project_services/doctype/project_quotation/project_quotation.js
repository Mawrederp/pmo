// Copyright (c) 2018, s and contributors
// For license information, please see license.txt




frappe.ui.form.on('Project Quotation', {
	profit: function (frm) {
		var markup = cur_frm.doc.profit / (cur_frm.doc.cost + cur_frm.doc.risk_contingency)
		var margin = cur_frm.doc.profit / cur_frm.doc.total_selling_price
		cur_frm.set_value("markup", Math.round(markup * 100));
		cur_frm.set_value("margin", Math.round(margin * 100));
	},
	profit_1: function (frm) {
		var markup_1 = cur_frm.doc.profit_1 / (cur_frm.doc.cost_1 + cur_frm.doc.risk_contingency_1)
		var margin_1 = cur_frm.doc.profit_1 / cur_frm.doc.total_selling_price_1
		cur_frm.set_value("markup_1", Math.round(markup_1 * 100));
		cur_frm.set_value("margin_1", Math.round(margin_1 * 100));
	},
	profit_2: function (frm) {
		var markup_2 = cur_frm.doc.profit_2 / (cur_frm.doc.cost_2 + cur_frm.doc.risk_contingency_2)
		var margin_2 = cur_frm.doc.profit_2 / cur_frm.doc.total_selling_price_2
		cur_frm.set_value("markup_2", Math.round(markup_2 * 100));
		cur_frm.set_value("margin_2", Math.round(margin_2 * 100));
	},
	profit_3: function (frm) {
		var markup_3 = cur_frm.doc.profit_3/(cur_frm.doc.cost_3+cur_frm.doc.risk_contingency_3)
		var margin_3 = cur_frm.doc.profit_3/cur_frm.doc.total_selling_price_3
		cur_frm.set_value("markup_3", Math.round(markup_3*100));
		cur_frm.set_value("margin_3", Math.round(margin_3*100));
	},
	profit_4: function (frm) {
		var markup_4 = cur_frm.doc.profit_4/(cur_frm.doc.cost_4+cur_frm.doc.risk_contingency_4)
		var margin_4 = cur_frm.doc.profit_4/cur_frm.doc.total_selling_price_4
		cur_frm.set_value("markup_4", Math.round(markup_4*100));
		cur_frm.set_value("margin_4", Math.round(margin_4*100));
	},
	profit_5: function (frm) {
		var markup_5 = cur_frm.doc.profit_5/(cur_frm.doc.cost_5+cur_frm.doc.risk_contingency_5)
		var margin_5 = cur_frm.doc.profit_5/cur_frm.doc.total_selling_price_5
		cur_frm.set_value("markup_5", Math.round(markup_5*100));
		cur_frm.set_value("margin_5", Math.round(margin_5*100));
	},
	validate: function (frm) {
		$.each(cur_frm.doc.items_details || [], function (i, d) {
			frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses);
		});

		var grand_total = 0;
		$.each(frm.doc.resources_details || [], function (i, d) {
			grand_total += flt(d.overhead_expenses);
		});
		frm.set_value("total_overhead_expenses", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details || [], function (i, d) {
			grand_total += flt(d.total_cost);
		});
		frm.set_value("cost", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details || [], function (i, d) {
			grand_total += flt(d.selling_price);
		});
		frm.set_value("selling_price", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details || [], function (i, d) {
			grand_total += flt(d.contingency);
		});
		frm.set_value("risk_contingency", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details || [], function (i, d) {
			grand_total += flt(d.final_selling_price);
		});
		frm.set_value("total_selling_price", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details || [], function (i, d) {
			grand_total += flt(d.profit);
		});
		frm.set_value("profit", grand_total);
		$.each(cur_frm.doc.items_details_1 || [], function (i, d) {
			frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_1);
		});

		var grand_total = 0;
		$.each(frm.doc.resources_details_1 || [], function (i, d) {
			grand_total += flt(d.overhead_expenses);
		});
		frm.set_value("total_overhead_expenses_1", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_1 || [], function (i, d) {
			grand_total += flt(d.total_cost);
		});
		frm.set_value("cost_1", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_1 || [], function (i, d) {
			grand_total += flt(d.selling_price_1);
		});
		frm.set_value("selling_price_1", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_1 || [], function (i, d) {
			grand_total += flt(d.contingency);
		});
		frm.set_value("risk_contingency_1", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_1 || [], function (i, d) {
			grand_total += flt(d.final_selling_price);
		});
		frm.set_value("total_selling_price_1", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_1 || [], function (i, d) {
			grand_total += flt(d.profit_1);
		});
		frm.set_value("profit_1", grand_total);
		//////////////////////////////

		$.each(cur_frm.doc.items_details_1 || [], function (i, d) {
			frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_1);
		});

		var grand_total = 0;
		$.each(frm.doc.resources_details_1 || [], function (i, d) {
			grand_total += flt(d.overhead_expenses);
		});
		frm.set_value("total_overhead_expenses_1", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_1 || [], function (i, d) {
			grand_total += flt(d.total_cost);
		});
		frm.set_value("cost_1", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_1 || [], function (i, d) {
			grand_total += flt(d.selling_price_1);
		});
		frm.set_value("selling_price_1", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_1 || [], function (i, d) {
			grand_total += flt(d.contingency);
		});
		frm.set_value("risk_contingency_1", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_1 || [], function (i, d) {
			grand_total += flt(d.final_selling_price);
		});
		frm.set_value("total_selling_price_1", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_1 || [], function (i, d) {
			grand_total += flt(d.profit_1);
		});
		frm.set_value("profit_1", grand_total);

		$.each(cur_frm.doc.items_details_2 || [], function (i, d) {
			frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_2);
		});

		var grand_total = 0;
		$.each(frm.doc.resources_details_2 || [], function (i, d) {
			grand_total += flt(d.overhead_expenses);
		});
		frm.set_value("total_overhead_expenses_2", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_2 || [], function (i, d) {
			grand_total += flt(d.total_cost);
		});
		frm.set_value("cost_2", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_2 || [], function (i, d) {
			grand_total += flt(d.selling_price_2);
		});
		frm.set_value("selling_price_2", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_2 || [], function (i, d) {
			grand_total += flt(d.contingency);
		});
		frm.set_value("risk_contingency_2", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_2 || [], function (i, d) {
			grand_total += flt(d.final_selling_price);
		});
		frm.set_value("total_selling_price_2", grand_total);

		var grand_total = 0;
		$.each(frm.doc.items_details_2 || [], function (i, d) {
			grand_total += flt(d.profit_2);
		});
		frm.set_value("profit_2", grand_total);

		$.each(cur_frm.doc.items_details_3 || [], function(i, d) {
	    	frappe.model.set_value("Items Details", d.name , 'tawaris_services', cur_frm.doc.total_overhead_expenses_3);
	    }); 

		var grand_total = 0;
	    $.each(frm.doc.resources_details_3 || [], function(i, d) {
	        grand_total += flt(d.overhead_expenses);
	    });
	    frm.set_value("total_overhead_expenses_3", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_3 || [], function(i, d) {
	        grand_total += flt(d.total_cost);
	    });
	    frm.set_value("cost_3", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_3 || [], function(i, d) {
	        grand_total += flt(d.selling_price_3);
	    });
	    frm.set_value("selling_price_3", grand_total);

		var grand_total = 0;
	    $.each(frm.doc.items_details_3 || [], function(i, d) {
	        grand_total += flt(d.contingency);
	    });
	    frm.set_value("risk_contingency_3", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_3 || [], function(i, d) {
	        grand_total += flt(d.final_selling_price);
	    });
	    frm.set_value("total_selling_price_3", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_3 || [], function(i, d) {
	        grand_total += flt(d.profit_3);
	    });
		frm.set_value("profit_3", grand_total);
		

		$.each(cur_frm.doc.items_details_4 || [], function(i, d) {
	    	frappe.model.set_value("Items Details", d.name , 'tawaris_services', cur_frm.doc.total_overhead_expenses_4);
	    }); 

		var grand_total = 0;
	    $.each(frm.doc.resources_details_4 || [], function(i, d) {
	        grand_total += flt(d.overhead_expenses);
	    });
	    frm.set_value("total_overhead_expenses_4", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_4 || [], function(i, d) {
	        grand_total += flt(d.total_cost);
	    });
	    frm.set_value("cost_4", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_4 || [], function(i, d) {
	        grand_total += flt(d.selling_price_4);
	    });
	    frm.set_value("selling_price_4", grand_total);

		var grand_total = 0;
	    $.each(frm.doc.items_details_4 || [], function(i, d) {
	        grand_total += flt(d.contingency);
	    });
	    frm.set_value("risk_contingency_4", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_4 || [], function(i, d) {
	        grand_total += flt(d.final_selling_price);
	    });
	    frm.set_value("total_selling_price_4", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_4 || [], function(i, d) {
	        grand_total += flt(d.profit_4);
	    });
		frm.set_value("profit_4", grand_total);
		
		$.each(cur_frm.doc.items_details_5 || [], function(i, d) {
	    	frappe.model.set_value("Items Details", d.name , 'tawaris_services', cur_frm.doc.total_overhead_expenses_5);
	    }); 

		var grand_total = 0;
	    $.each(frm.doc.resources_details_5 || [], function(i, d) {
	        grand_total += flt(d.overhead_expenses);
	    });
	    frm.set_value("total_overhead_expenses_5", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_5 || [], function(i, d) {
	        grand_total += flt(d.total_cost);
	    });
	    frm.set_value("cost_5", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_5 || [], function(i, d) {
	        grand_total += flt(d.selling_price_5);
	    });
	    frm.set_value("selling_price_5", grand_total);

		var grand_total = 0;
	    $.each(frm.doc.items_details_5 || [], function(i, d) {
	        grand_total += flt(d.contingency);
	    });
	    frm.set_value("risk_contingency_5", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_5 || [], function(i, d) {
	        grand_total += flt(d.final_selling_price);
	    });
	    frm.set_value("total_selling_price_5", grand_total);

	    var grand_total = 0;
	    $.each(frm.doc.items_details_5 || [], function(i, d) {
	        grand_total += flt(d.profit_5);
	    });
	    frm.set_value("profit_5", grand_total);

	}

});

cur_frm.set_query("resources", "resources_details", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});


cur_frm.cscript.total_overhead_expenses = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses);
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

	var grand_total = 0;
	$.each(frm.doc.resources_details || [], function (i, d) {
		grand_total += flt(d.overhead_expenses);
	});
	frm.set_value("total_overhead_expenses", grand_total);
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

		if (frm.selected_doc.parentfield == "items_details") {
			if (cur_frm.doc.total_overhead_expenses) {
				frappe.model.set_value(cdt, cdn, "tawaris_services", cur_frm.doc.total_overhead_expenses);
			}
		} else if (frm.selected_doc.parentfield == "items_details_1") {
			{
				if (cur_frm.doc.total_overhead_expenses_1) {
					frappe.model.set_value(cdt, cdn, "tawaris_services", cur_frm.doc.total_overhead_expenses_1);
				}
			}
		} else if (frm.selected_doc.parentfield == "items_details_2") {
			{
				if (cur_frm.doc.total_overhead_expenses_2) {
					frappe.model.set_value(cdt, cdn, "tawaris_services", cur_frm.doc.total_overhead_expenses_2);
				}
			}
		} else if (frm.selected_doc.parentfield == "items_details_3") {
			{
				if (cur_frm.doc.total_overhead_expenses_3) {
					frappe.model.set_value(cdt, cdn, "tawaris_services", cur_frm.doc.total_overhead_expenses_3);
				}
			}
		} else if (frm.selected_doc.parentfield == "items_details_4") {
			{
				if (cur_frm.doc.total_overhead_expenses_4) {
					frappe.model.set_value(cdt, cdn, "tawaris_services", cur_frm.doc.total_overhead_expenses_4);
				}
			}
		} else if (frm.selected_doc.parentfield == "items_details_5") {
			{
				if (cur_frm.doc.total_overhead_expenses_5) {
					frappe.model.set_value(cdt, cdn, "tawaris_services", cur_frm.doc.total_overhead_expenses_5);
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
		if (d.profit && d.final_selling_price) {
			var total = Math.round((d.profit / d.final_selling_price) * 100)
			frappe.model.set_value(cdt, cdn, "margin", total);
		}
	},
	final_selling_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (d.profit && d.final_selling_price) {
			var total = Math.round((d.profit / d.final_selling_price) * 100)
			frappe.model.set_value(cdt, cdn, "margin", total);
		}
	},




});





frappe.ui.form.on("Items Details", "total_cost", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details || [], function (i, d) {
		grand_total += flt(d.total_cost);
	});
	frm.set_value("cost", grand_total);
});

frappe.ui.form.on("Items Details", "selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details || [], function (i, d) {
		grand_total += flt(d.selling_price);
	});
	frm.set_value("selling_price", grand_total);
});


frappe.ui.form.on("Items Details", "contingency", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details || [], function (i, d) {
		grand_total += flt(d.contingency);
	});
	frm.set_value("risk_contingency", grand_total);
});


frappe.ui.form.on("Items Details", "final_selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details || [], function (i, d) {
		grand_total += flt(d.final_selling_price);
	});
	frm.set_value("total_selling_price", grand_total);
});



frappe.ui.form.on("Items Details", "profit", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details || [], function (i, d) {
		grand_total += flt(d.profit);
	});
	frm.set_value("profit", grand_total);
});




cur_frm.set_query("resources", "resources_details_1", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.cscript.total_overhead_expenses_1 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_1 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_1);
	});


}
frappe.ui.form.on("Resources Details", "overhead_expenses", function (frm, cdt, cdn) {
	var grand_total = 0;
	$.each(frm.doc.resources_details_1 || [], function (i, d) {
		grand_total += flt(d.overhead_expenses);
	});
	frm.set_value("total_overhead_expenses_1", grand_total);
});
frappe.ui.form.on("Items Details", "total_cost", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_1 || [], function (i, d) {
		grand_total += flt(d.total_cost);
	});
	frm.set_value("cost_1", grand_total);
});

frappe.ui.form.on("Items Details", "selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_1 || [], function (i, d) {
		grand_total += flt(d.selling_price);
	});
	frm.set_value("selling_price_1", grand_total);
});

frappe.ui.form.on("Items Details", "contingency", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_1 || [], function (i, d) {
		grand_total += flt(d.contingency);
	});
	frm.set_value("risk_contingency_1", grand_total);
});
frappe.ui.form.on("Items Details", "final_selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_1 || [], function (i, d) {
		grand_total += flt(d.final_selling_price);
	});
	frm.set_value("total_selling_price_1", grand_total);
});
frappe.ui.form.on("Items Details", "profit", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_1 || [], function (i, d) {
		grand_total += flt(d.profit);
	});
	frm.set_value("profit_1", grand_total);
});




cur_frm.set_query("resources", "resources_details_2", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.cscript.total_overhead_expenses_2 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_2 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_2);
	});


}
frappe.ui.form.on("Resources Details", "overhead_expenses", function (frm, cdt, cdn) {
	var grand_total = 0;
	$.each(frm.doc.resources_details_2 || [], function (i, d) {
		grand_total += flt(d.overhead_expenses);
	});
	frm.set_value("total_overhead_expenses_2", grand_total);
});
frappe.ui.form.on("Items Details", "total_cost", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_2 || [], function (i, d) {
		grand_total += flt(d.total_cost);
	});
	frm.set_value("cost_2", grand_total);
});

frappe.ui.form.on("Items Details", "selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_2 || [], function (i, d) {
		grand_total += flt(d.selling_price);
	});
	frm.set_value("selling_price_2", grand_total);
});

frappe.ui.form.on("Items Details", "contingency", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_2 || [], function (i, d) {
		grand_total += flt(d.contingency);
	});
	frm.set_value("risk_contingency_2", grand_total);
});
frappe.ui.form.on("Items Details", "final_selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_2 || [], function (i, d) {
		grand_total += flt(d.final_selling_price);
	});
	frm.set_value("total_selling_price_2", grand_total);
});
frappe.ui.form.on("Items Details", "profit", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_2 || [], function (i, d) {
		grand_total += flt(d.profit);
	});
	frm.set_value("profit_2", grand_total);
});




cur_frm.set_query("resources", "resources_details_3", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.cscript.total_overhead_expenses_3 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_3 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_3);
	});


}
frappe.ui.form.on("Resources Details", "overhead_expenses", function (frm, cdt, cdn) {
	var grand_total = 0;
	$.each(frm.doc.resources_details_3 || [], function (i, d) {
		grand_total += flt(d.overhead_expenses);
	});
	frm.set_value("total_overhead_expenses_3", grand_total);
});
frappe.ui.form.on("Items Details", "total_cost", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_3 || [], function (i, d) {
		grand_total += flt(d.total_cost);
	});
	frm.set_value("cost_3", grand_total);
});

frappe.ui.form.on("Items Details", "selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_3 || [], function (i, d) {
		grand_total += flt(d.selling_price);
	});
	frm.set_value("selling_price_3", grand_total);
});

frappe.ui.form.on("Items Details", "contingency", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_3 || [], function (i, d) {
		grand_total += flt(d.contingency);
	});
	frm.set_value("risk_contingency_3", grand_total);
});
frappe.ui.form.on("Items Details", "final_selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_3 || [], function (i, d) {
		grand_total += flt(d.final_selling_price);
	});
	frm.set_value("total_selling_price_3", grand_total);
});
frappe.ui.form.on("Items Details", "profit", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_3 || [], function (i, d) {
		grand_total += flt(d.profit);
	});
	frm.set_value("profit_3", grand_total);
});




cur_frm.set_query("resources", "resources_details_4", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.cscript.total_overhead_expenses_4 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_4 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_4);
	});


}
frappe.ui.form.on("Resources Details", "overhead_expenses", function (frm, cdt, cdn) {
	var grand_total = 0;
	$.each(frm.doc.resources_details_4 || [], function (i, d) {
		grand_total += flt(d.overhead_expenses);
	});
	frm.set_value("total_overhead_expenses_4", grand_total);
});
frappe.ui.form.on("Items Details", "total_cost", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_4 || [], function (i, d) {
		grand_total += flt(d.total_cost);
	});
	frm.set_value("cost_4", grand_total);
});

frappe.ui.form.on("Items Details", "selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_4 || [], function (i, d) {
		grand_total += flt(d.selling_price);
	});
	frm.set_value("selling_price_4", grand_total);
});

frappe.ui.form.on("Items Details", "contingency", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_4 || [], function (i, d) {
		grand_total += flt(d.contingency);
	});
	frm.set_value("risk_contingency_4", grand_total);
});
frappe.ui.form.on("Items Details", "final_selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_4 || [], function (i, d) {
		grand_total += flt(d.final_selling_price);
	});
	frm.set_value("total_selling_price_4", grand_total);
});
frappe.ui.form.on("Items Details", "profit", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_4 || [], function (i, d) {
		grand_total += flt(d.profit);
	});
	frm.set_value("profit_4", grand_total);
});





cur_frm.set_query("resources", "resources_details_5", function (doc, cdt, cdn) {
	var d = locals[cdt][cdn];
	return {
		filters: [
			['Item', 'item_group', '=', d.group_code]
		]
	}
});
cur_frm.cscript.total_overhead_expenses_5 = function (frm, cdt, cdn) {
	$.each(cur_frm.doc.items_details_5 || [], function (i, d) {
		frappe.model.set_value("Items Details", d.name, 'tawaris_services', cur_frm.doc.total_overhead_expenses_5);
	});


}
frappe.ui.form.on("Resources Details", "overhead_expenses", function (frm, cdt, cdn) {
	var grand_total = 0;
	$.each(frm.doc.resources_details_5 || [], function (i, d) {
		grand_total += flt(d.overhead_expenses);
	});
	frm.set_value("total_overhead_expenses_5", grand_total);
});
frappe.ui.form.on("Items Details", "total_cost", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_5 || [], function (i, d) {
		grand_total += flt(d.total_cost);
	});
	frm.set_value("cost_5", grand_total);
});

frappe.ui.form.on("Items Details", "selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_5 || [], function (i, d) {
		grand_total += flt(d.selling_price);
	});
	frm.set_value("selling_price_5", grand_total);
});

frappe.ui.form.on("Items Details", "contingency", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_5 || [], function (i, d) {
		grand_total += flt(d.contingency);
	});
	frm.set_value("risk_contingency_5", grand_total);
});
frappe.ui.form.on("Items Details", "final_selling_price", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_5 || [], function (i, d) {
		grand_total += flt(d.final_selling_price);
	});
	frm.set_value("total_selling_price_5", grand_total);
});
frappe.ui.form.on("Items Details", "profit", function (frm, cdt, cdn) {
	// code for calculate total and set on parent field.
	var grand_total = 0;
	$.each(frm.doc.items_details_5 || [], function (i, d) {
		grand_total += flt(d.profit);
	});
	frm.set_value("profit_5", grand_total);
});