// Copyright (c) 2018, s and contributors
// For license information, please see license.txt




frappe.ui.form.on('Project Quotation', {
	profit: function (frm) {
		var markup = cur_frm.doc.profit/(cur_frm.doc.cost+cur_frm.doc.risk_contingency)
		var margin = cur_frm.doc.profit/cur_frm.doc.total_selling_price
		cur_frm.set_value("markup", Math.round(markup*100));
		cur_frm.set_value("margin", Math.round(margin*100));
	},
	// total_cost: function (frm) {
	// 	var total = cur_frm.doc.profit/(cur_frm.doc.cost+cur_frm.doc.risk_contingency)
	// 	cur_frm.set_value("markup", total);
	// },
	// risk_contingency: function (frm) {
	// 	var total = cur_frm.doc.profit/(cur_frm.doc.cost+cur_frm.doc.risk_contingency)
	// 	cur_frm.set_value("markup", total);
	// },
	// total_selling_price: function (frm) {
	// 	var total = cur_frm.doc.profit/cur_frm.doc.total_selling_price
	// 	cur_frm.set_value("margin", total);
	// },


	// profit: function (frm) {
	// 	var markup = cur_frm.doc.profit/(cur_frm.doc.total_cost+cur_frm.doc.risk_contingency)
	// 	frappe.set_value("markup", markup);
	// 	var margin = cur_frm.doc.profit/cur_frm.doc.final_selling_price
	// 	frappe.set_value("margin", margin);
	// },
	// total_cost: function (frm) {
	// 	var total = cur_frm.doc.profit/(cur_frm.doc.total_cost+cur_frm.doc.risk_contingency)
	// 	frappe.set_value("markup", total);
	// },
	// risk_contingency: function (frm) {
	// 	var total = cur_frm.doc.profit/(cur_frm.doc.total_cost+cur_frm.doc.risk_contingency)
	// 	frappe.set_value("markup", total);
	// },
	// final_selling_price: function (frm) {
	// 	var total = cur_frm.doc.profit/cur_frm.doc.final_selling_price
	// 	frappe.set_value("margin", total);
	// },

});


frappe.ui.form.on('Resources Details', {
	cost_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.cost_price && d.quantity && d.months){
			var total = ((d.cost_price*1.45)*d.months)*d.quantity
			frappe.model.set_value(cdt, cdn, "overhead_expenses", total);
		}
	},
	quantity: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.cost_price && d.quantity && d.months){
			var total = ((d.cost_price*1.45)*d.months)*d.quantity
			frappe.model.set_value(cdt, cdn, "overhead_expenses", total);
		}
	},
	months: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.cost_price && d.quantity && d.months){
			var total = ((d.cost_price*1.45)*d.months)*d.quantity
			frappe.model.set_value(cdt, cdn, "overhead_expenses", total);
		}
	}

});


frappe.ui.form.on("Resources Details", "overhead_expenses", function(frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    grand_total = 0;
    $.each(frm.doc.resources_details || [], function(i, d) {
        grand_total += flt(d.overhead_expenses);
    });
    frm.set_value("total_overhead_expenses", grand_total);
});



frappe.ui.form.on('Items Details', {
	cost_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.cost_price && d.currency=='SAR'){
			var total = d.cost_price
		}else if(d.cost_price && d.currency=='$'){
			var total = d.cost_price*3.75
		}else if(d.cost_price){
			var total = 0
		}

		frappe.model.set_value(cdt, cdn, "sar_cost_price", total);

		if(cur_frm.doc.total_overhead_expenses){
			frappe.model.set_value(cdt, cdn, "tawaris_services", cur_frm.doc.total_overhead_expenses);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency+d.selling_price);
	},
	currency: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.cost_price && d.currency=='SAR'){
			var total = d.cost_price
		}else if(d.cost_price && d.currency=='$'){
			var total = d.cost_price*3.75
		}else{
			var total = 0
		}

		frappe.model.set_value(cdt, cdn, "sar_cost_price", total);
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency+d.selling_price);
	},
	sar_cost_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.sar_cost_price && d.quantity){
			var total = d.sar_cost_price*d.quantity
			frappe.model.set_value(cdt, cdn, "cost_price_unit", total);
		}
	},
	quantity: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.sar_cost_price && d.quantity){
			var total = d.sar_cost_price*d.quantity
			frappe.model.set_value(cdt, cdn, "cost_price_unit", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency+d.selling_price);
	},
	markup: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.markup){
			frappe.model.set_value(cdt, cdn, "markup_follow", d.markup);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency+d.selling_price);
	},
	cost_price_unit: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.cost_price_unit&&d.markup_follow){
			var total = d.cost_price_unit+(d.cost_price_unit*(d.markup_follow/100))
			frappe.model.set_value(cdt, cdn, "selling_price_unit", total);
		}
		if(d.cost_price_unit&&d.time_unit){
			var total = d.cost_price_unit*d.time_unit
			frappe.model.set_value(cdt, cdn, "total_cost_price", total);
		}
	},
	markup_follow: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.cost_price_unit&&d.markup_follow){
			var total = d.cost_price_unit+(d.cost_price_unit*(d.markup_follow/100))
			frappe.model.set_value(cdt, cdn, "selling_price_unit", total);
		}
		if(d.cost_price_ts&&d.markup_follow){
			var total = d.cost_price_ts+(d.cost_price_ts*d.markup_follow)
			frappe.model.set_value(cdt, cdn, "selling_price_ts", total);
		}
	},
	time_unit: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.cost_price_unit&&d.time_unit){
			var total = d.cost_price_unit*d.time_unit
			frappe.model.set_value(cdt, cdn, "total_cost_price", total);
		}
		if(d.selling_price_unit&&d.time_unit){
			var total = d.selling_price_unit*d.time_unit
			frappe.model.set_value(cdt, cdn, "total_selling_price", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency+d.selling_price);
	},
	selling_price_unit: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.selling_price_unit&&d.time_unit){
			var total = d.selling_price_unit*d.time_unit
			frappe.model.set_value(cdt, cdn, "total_selling_price", total);
		}
	},
	tawaris_services: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.tawaris_services&&d.time_unit_services){
			var total = d.tawaris_services*d.time_unit_services
			frappe.model.set_value(cdt, cdn, "cost_price_ts", total);
		}
	},
	time_unit_services: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "final_selling_price", 0);
		if(d.tawaris_services&&d.time_unit_services){
			var total = d.tawaris_services*d.time_unit_services
			frappe.model.set_value(cdt, cdn, "cost_price_ts", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency+d.selling_price);
	},
	cost_price_ts: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.cost_price_ts&&d.markup_follow){
			var total = d.cost_price_ts+(d.cost_price_ts*(d.markup_follow/100))
			frappe.model.set_value(cdt, cdn, "selling_price_ts", total);
		}
		if(d.total_cost_price&&d.cost_price_ts){
			var total = d.total_cost_price+d.cost_price_ts
			frappe.model.set_value(cdt, cdn, "total_cost", total);
		}
	},
	total_cost_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.total_cost_price&&d.cost_price_ts){
			var total = d.total_cost_price+d.cost_price_ts
			frappe.model.set_value(cdt, cdn, "total_cost", total);
		}
	},
	total_selling_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.total_selling_price&&d.selling_price_ts){
			var total = d.total_selling_price+d.selling_price_ts
			frappe.model.set_value(cdt, cdn, "selling_price", total);
		}
	},
	selling_price_ts: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.total_selling_price&&d.selling_price_ts){
			var total = d.total_selling_price+d.selling_price_ts
			frappe.model.set_value(cdt, cdn, "selling_price", total);
		}
	},
	total_cost: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.total_cost&&d.selling_price){
			var total = d.selling_price-d.total_cost
			frappe.model.set_value(cdt, cdn, "profit", total);
		}
		if(d.risk&&d.total_cost){
			var total = (d.risk/100)*d.total_cost
			frappe.model.set_value(cdt, cdn, "contingency", total);
		}
	},
	selling_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.total_cost&&d.selling_price){
			var total = d.selling_price-d.total_cost
			frappe.model.set_value(cdt, cdn, "profit", total);
		}
		if(d.contingency&&d.selling_price){
			var total = d.contingency+d.selling_price
			frappe.model.set_value(cdt, cdn, "final_selling_price", total);
		}
	},
	risk: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "final_selling_price", 0);
		if(d.risk&&d.total_cost){
			var total = (d.risk/100)*d.total_cost
			frappe.model.set_value(cdt, cdn, "contingency", total);
		}
		frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency+d.selling_price);
	},
	contingency: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.contingency&&d.selling_price){
			var total = d.contingency+d.selling_price
			frappe.model.set_value(cdt, cdn, "final_selling_price", total);
		}
	},
	profit: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.profit&&d.final_selling_price){
			var total = Math.round((d.profit/d.final_selling_price)*100)
			frappe.model.set_value(cdt, cdn, "margin", total);
		}
	},
	final_selling_price: function (frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if(d.profit&&d.final_selling_price){
			var total = Math.round((d.profit/d.final_selling_price)*100)
			frappe.model.set_value(cdt, cdn, "margin", total);
		}
	},




});





frappe.ui.form.on("Items Details", "total_cost", function(frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    grand_total = 0;
    $.each(frm.doc.items_details || [], function(i, d) {
        grand_total += flt(d.total_cost);
    });
    frm.set_value("cost", grand_total);
});


frappe.ui.form.on("Items Details", "selling_price", function(frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    grand_total = 0;
    $.each(frm.doc.items_details || [], function(i, d) {
        grand_total += flt(d.selling_price);
    });
    frm.set_value("selling_price", grand_total);
});


frappe.ui.form.on("Items Details", "contingency", function(frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    grand_total = 0;
    $.each(frm.doc.items_details || [], function(i, d) {
        grand_total += flt(d.contingency);
    });
    frm.set_value("risk_contingency", grand_total);
});


frappe.ui.form.on("Items Details", "final_selling_price", function(frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    grand_total = 0;
    $.each(frm.doc.items_details || [], function(i, d) {
        grand_total += flt(d.final_selling_price);
    });
    frm.set_value("total_selling_price", grand_total);
});


frappe.ui.form.on("Items Details", "profit", function(frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    grand_total = 0;
    $.each(frm.doc.items_details || [], function(i, d) {
        grand_total += flt(d.profit);
    });
    frm.set_value("profit", grand_total);
});





// var first_time = false

// frappe.ui.form.on('Project Quotation', {
// 	risk_percentage: function (frm, cdt, cdn) {
// 		getRiskSellingTotals()
// 		getFinanceSellingTotals()
// 		getCommissionSellingTotals()
// 		getVatSellingTotals()
// 	},
// 	financing_percentage: function (frm, cdt, cdn) {
// 		getFinanceSellingTotals()
// 		getCommissionSellingTotals()
// 		getVatSellingTotals()
// 	},
// 	commission_percentage: function (frm, cdt, cdn) {
// 		getCommissionSellingTotals()
// 		getVatSellingTotals()
// 	},
// 	vat_percentage: function (frm, cdt, cdn) {
// 		getVatSellingTotals()
// 	},

// 	risk_value: function (frm, cdt, cdn) {
// 		// getRiskPercentage();
// 	},
// 	financing_value: function (frm, cdt, cdn) {},
// 	commission_value: function (frm, cdt, cdn) {},
// 	vat_value: function (frm, cdt, cdn) {},

// });

/* 
function getRiskPercentage() {
	var list = ["_pmts", "_develop", "_hw", "_sw", "_manpower", "_support", "_training", "_expenses"];
	var risk_sell_total = 0;
	list.forEach(element => {
		var x = 0
		console.log()

		if (flt(cur_frm.doc["total_cost_price" + element])) {
			risk_sell_total += flt(cur_frm.doc["total_cost_price" + element]);

		}


	});
	var risk = cur_frm.doc.risk_value;
	console.log(risk)
	if (!risk || risk == "" || risk == undefined) {
		cur_frm.set_value("risk_value", 0);
		risk = 0;
	}
	risk = (risk / risk_sell_total) * 100;
	cur_frm.set_value("risk_percentage", (risk).toFixed(2));
} */

// function getRiskSellingTotals() {
// 	var list = ["_pmts", "_develop", "_hw", "_sw", "_manpower", "_support", "_training", "_expenses"];
// 	var risk_sell_total = 0;
// 	list.forEach(element => {
// 		var x = 0
// 		console.log()

// 		if (flt(cur_frm.doc["total_cost_price" + element])) {
// 			risk_sell_total += flt(cur_frm.doc["total_cost_price" + element]);

// 		}


// 	});
// 	var risk = cur_frm.doc.risk_percentage;
// 	if (!risk || risk == "" || risk == undefined) {
// 		cur_frm.set_value("risk_percentage", 1);
// 		risk = 1;
// 	}
// 	risk = risk / 100;
// 	cur_frm.set_value("total_cost_price_original_risk", (risk_sell_total).toFixed(2));
// 	cur_frm.set_value("risk_value", (risk_sell_total * risk).toFixed(2));
// 	cur_frm.set_value("total_cost_price_risk_contingency", ((risk_sell_total * risk) + risk_sell_total).toFixed(2));
// }

// function getFinanceSellingTotals() {
// 	var list = ["_pmts", "_develop", "_hw", "_sw", "_manpower", "_support", "_training", "_expenses"];
// 	var finance_sell_total = 0;
// 	list.forEach(element => {
// 		var x = 0
// 		console.log()

// 		if (flt(cur_frm.doc["total_cost_price" + element])) {
// 			finance_sell_total += flt(cur_frm.doc["total_cost_price" + element]);

// 		}


// 	});

// 	finance_sell_total += parseFloat(cur_frm.doc.risk_value);

// 	var financing = cur_frm.doc.financing_percentage;
// 	if (!financing || financing == "" || financing == undefined) {
// 		cur_frm.set_value("financing_percentage", 0);
// 		financing = 0;
// 	}
// 	financing = financing / 100;
// 	cur_frm.set_value("total_cost_price_original_finance", (finance_sell_total).toFixed(2));
// 	cur_frm.set_value("financing_value", (finance_sell_total * financing).toFixed(2));
// 	cur_frm.set_value("total_cost_price_finance", ((finance_sell_total * financing) + finance_sell_total).toFixed(2));
// }

// function getCommissionSellingTotals() {
// 	var list = ["_pmts", "_develop", "_hw", "_sw", "_manpower", "_support", "_training", "_expenses"];
// 	var commission_sell_total = 0;
// 	list.forEach(element => {
// 		var x = 0
// 		console.log()

// 		if (flt(cur_frm.doc["total_cost_price" + element])) {
// 			commission_sell_total += flt(cur_frm.doc["total_cost_price" + element]);

// 		}


// 	});
// 	commission_sell_total += parseFloat(cur_frm.doc.risk_value) + parseFloat(cur_frm.doc.financing_value);
// 	var commission = cur_frm.doc.commission_percentage;
// 	if (!commission || commission == "" || commission == undefined) {
// 		cur_frm.set_value("commission_percentage", 0);
// 		commission = 0;
// 	}
// 	commission = commission / 100;
// 	cur_frm.set_value("total_cost_price_original_commission", (commission_sell_total).toFixed(2));
// 	cur_frm.set_value("commission_value", (commission_sell_total * commission).toFixed(2));
// 	cur_frm.set_value("total_cost_price_commission", ((commission_sell_total * commission) + commission_sell_total).toFixed(2));
// }

// function getVatSellingTotals() {
// 	var list = ["_pmts", "_develop", "_hw", "_sw", "_manpower", "_support", "_training", "_expenses"];
// 	var vat_sell_total = 0;
// 	list.forEach(element => {
// 		var x = 0
// 		console.log()

// 		if (flt(cur_frm.doc["total_cost_price" + element])) {
// 			vat_sell_total += flt(cur_frm.doc["total_cost_price" + element]);

// 		}


// 	});
// 	vat_sell_total += parseFloat(cur_frm.doc.risk_value) + parseFloat(cur_frm.doc.financing_value) + parseFloat(cur_frm.doc.commission_value);
// 	var vat = cur_frm.doc.vat_percentage;
// 	if (!vat || vat == "" || vat == undefined) {
// 		cur_frm.set_value("vat_percentage", 0);
// 		vat = 0;
// 	}
// 	vat = vat / 100;
// 	cur_frm.set_value("total_cost_price_original_vat", (vat_sell_total).toFixed(2));
// 	cur_frm.set_value("vat_value", (vat_sell_total * vat).toFixed(2));
// 	cur_frm.set_value("total_cost_price_vat", ((vat_sell_total * vat) + vat_sell_total).toFixed(2));
// }

// function getFinalTotals(frm, string, doc) {
// 	getTotalOfField('total_cost_price', "total_cost_price" + string, doc, frm);
// 	getTotalOfField('selling_price', "total_selling_price" + string, doc, frm);
// 	getTotalOfField('profit', "total_profit" + string, doc, frm);

// 	if (cur_frm.doc["total_profit" + string] > 0 && cur_frm.doc["total_cost_price" + string] > 0) {
// 		var totals = 0;
// 		totals = flt(cur_frm.doc["total_profit" + string]) / flt(cur_frm.doc["total_cost_price" + string]) * 100;
// 		frm.set_value("total_markup" + string, totals.toFixed(2));
// 	} else {
// 		frm.set_value("total_markup" + string, 0);
// 	}
// 	if (cur_frm.doc["total_profit" + string] > 0 && cur_frm.doc["total_selling_price" + string] > 0) {
// 		var totals_margin = 0;
// 		totals_margin = flt(cur_frm.doc["total_profit" + string]) / flt(cur_frm.doc["total_selling_price" + string]) * 100;
// 		frm.set_value("total_margin" + string, totals_margin.toFixed(2));
// 	} else {
// 		frm.set_value("total_margin" + string, 0);
// 	}


// }

// function get_item_price(frm, cdt, cdn, item, field) {
// 	var child = locals[cdt][cdn];
// 	frappe.model.set_value(cdt, cdn, field, 0);

// 	if (!child.group_code && child.items != "" && child.items != undefined) {
// 		frappe.model.set_value(cdt, cdn, "items", "");
// 		frappe.throw('Please Specify A Group for the Item');
// 	} else if (item && item != "" && child.group_code) {
// 		frappe.call({
// 			method: "pmo.project_services.doctype.project_quotation.project_quotation.get_item_price",
// 			args: {
// 				item: item
// 			},
// 			callback: function (data) {
// 				if (data.message) {
// 					frappe.model.set_value(cdt, cdn, field, data.message[0].price_list_rate);
// 					if (data.message[0].currency == "USD") {
// 						frappe.model.set_value(cdt, cdn, "currency", "USD");
// 					} else {
// 						frappe.model.set_value(cdt, cdn, "currency", "SAR");
// 					}

// 				}
// 			}
// 		});
// 	}

// }

// function getTotalOfField(myfield, mytotalfield, mychildtable, frm) {
// 	var total_price = 0;
// 	$.each(mychildtable || [], function (i, d) {
// 		total_price += flt(d[myfield]) || 0;
// 	});
// 	frm.set_value(mytotalfield, total_price.toFixed(2));
// }

// function getTotal(child, string) {
// 	if (string == "_support") {
// 		child.total_cost_price = child.sar_cost_price * (child.months) * (child.quantity);
// 	} else if (string == "_expenses") {
// 		child.total_cost_price = child.cost_price * (child.quantity);
// 	} else if (string == "_pmts") {
// 		child.total_cost_price = ((child.cost_price * (1 + (child.overhead_value / 100)))) * (child.months) * (child.quantity / 100);
// 	} else if (string == "_manpower") {
// 		child.total_cost_price = ((child.cost_price * (1 + (child.overhead_value / 100)))) * (child.months) * (child.quantity);
// 	} else {
// 		child.total_cost_price = child.sar_cost_price * (child.quantity);

// 	}

// }

// function getSellingPrice(child) {
// 	child.selling_price = child.total_cost_price + (child.total_cost_price * (child.markup / 100));

// }

// function getProfit(child) {
// 	child.profit = child.selling_price - child.total_cost_price;

// }

// function getMargin(child) {
// 	child.margin = (child.profit / child.selling_price) * 100;
// 	if (isNaN(child.margin)) {
// 		child.margin = 0;
// 	}

// }

// function getOverheadExpenses(child) {
// 	child.overhead_expenses = (child.quantity) * child.months;
// }

// function ReCalculateAllData(frm, cdt, cdn, string, doc) {
// 	var child = locals[cdt][cdn];
// 	getOverheadExpenses(child);
// 	getTotal(child, string);
// 	getSellingPrice(child);
// 	getProfit(child);
// 	getMargin(child);
// 	getFinalTotals(frm, string, doc);
// 	frm.refresh_fields();
// 	getRiskSellingTotals();
// 	getFinanceSellingTotals();
// 	getCommissionSellingTotals();
// 	getVatSellingTotals();



// }
// frappe.ui.form.on('Project Management and Technical Services', {
// 	project_management_and_technical_services_remove: function (frm) {
// 		getFinalTotals(frm, "_pmts", frm.doc.project_management_and_technical_services);
// 	},
// 	cost_price: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);
// 	},
// 	months: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);

// 	},
// 	quantity: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);

// 	},
// 	total_cost_price: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);

// 	},
// 	markup: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);

// 	},
// 	overhead_value: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);
// 	},
// 	employee: function (frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		frappe.model.set_value(cdt, cdn, "cost_price", 0);
// 		if (d.designation && d.employee != "" && d.employee != undefined) {
// 			frappe.call({
// 				method: "pmo.project_services.doctype.project_quotation.project_quotation.get_basic_salary",
// 				args: {
// 					employee: d.employee
// 				},
// 				callback: function (data) {
// 					frappe.model.set_value(cdt, cdn, "cost_price", data.message);
// 				}
// 			});
// 			ReCalculateAllData(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);

// 		} else if (!d.designation && d.employee != "" && d.employee != undefined) {
// 			frappe.model.set_value(cdt, cdn, "employee", "");
// 			frappe.throw('Please Specify A Designation');


// 		}


// 	},
// 	designation: function (frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		// if (d.designation == "" || d.designation == undefined) {
// 		frappe.model.set_value(cdt, cdn, "employee", "");

// 		// }
// 		ReCalculateAllData(frm, cdt, cdn, "_pmts", frm.doc.project_management_and_technical_services);
// 	}
// });

// cur_frm.set_query("employee", 'project_management_and_technical_services', function (doc, cdt, cdn) {
// 	var d = locals[cdt][cdn];
// 	return {
// 		"filters": {
// 			"designation": d.designation
// 		}
// 	}
// });



// cur_frm.set_query("items", "development_services", function (doc, cdt, cdn) {
// 	var d = locals[cdt][cdn];
// 	return {
// 		filters: [
// 			['Item', 'item_group', '=', d.group_code]
// 		]
// 	}
// });


// frappe.ui.form.on('Development Services', {
// 	development_services_remove: function (frm) {
// 		getFinalTotals(frm, "_develop", frm.doc.development_services);
// 	},
// 	cost_price: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		if (row.currency == 'SAR' && row.cost_price) {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
// 		} else {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_develop", frm.doc.development_services);

// 	},
// 	quantity: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_develop", frm.doc.development_services);

// 	},
// 	total_cost_price: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_develop", frm.doc.development_services);

// 	},
// 	markup: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_develop", frm.doc.development_services);

// 	},
// 	items: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.development_services);
// 		ReCalculateAllData(frm, cdt, cdn, "_develop", frm.doc.development_services);


// 	},
// 	group_code: function (frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		frappe.model.set_value(cdt, cdn, "items", "");
// 	},
// 	currency: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		if (row.currency == 'SAR' && row.cost_price) {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
// 		} else {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_develop", frm.doc.development_services);
// 	}

// });


// frappe.ui.form.on('Hardware', {
// 	hardware_remove: function (frm) {
// 		getFinalTotals(frm, "_hw", frm.doc.hardware);
// 	},
// 	cost_price: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		if (row.currency == 'SAR' && row.cost_price) {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
// 		} else {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_hw", frm.doc.hardware);

// 	},
// 	quantity: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_hw", frm.doc.hardware);

// 	},
// 	total_cost_price: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_hw", frm.doc.hardware);

// 	},
// 	markup: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_hw", frm.doc.hardware);

// 	},
// 	items: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.hardware);
// 		ReCalculateAllData(frm, cdt, cdn, "_hw", frm.doc.hardware);


// 	},
// 	group_code: function (frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		if (d.group_code && d.group_code != "" && d.group_code != undefined) {
// 			frappe.model.set_value(cdt, cdn, "items", "");

// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_hw", frm.doc.hardware);
// 	},
// 	currency: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		if (row.currency == 'SAR' && row.cost_price) {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
// 		} else {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_hw", frm.doc.hardware);
// 	}

// });


// cur_frm.set_query("items", "hardware", function (doc, cdt, cdn) {
// 	var d = locals[cdt][cdn];
// 	return {
// 		filters: [
// 			['Item', 'item_group', '=', d.group_code]
// 		]
// 	}
// });


// frappe.ui.form.on('Software', {
// 	software_remove: function (frm) {
// 		getFinalTotals(frm, "_sw", frm.doc.software);
// 	},
// 	cost_price: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		if (row.currency == 'SAR' && row.cost_price) {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
// 		} else {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_sw", frm.doc.software);

// 	},
// 	quantity: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_sw", frm.doc.software);

// 	},
// 	total_cost_price: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_sw", frm.doc.software);

// 	},
// 	markup: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_sw", frm.doc.software);

// 	},
// 	items: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.software);
// 		ReCalculateAllData(frm, cdt, cdn, "_sw", frm.doc.software);


// 	},
// 	group_code: function (frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		if (d.group_code && d.group_code != "" && d.group_code != undefined) {
// 			frappe.model.set_value(cdt, cdn, "items", "");

// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_sw", frm.doc.software);
// 	},
// 	currency: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		if (row.currency == 'SAR' && row.cost_price) {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
// 		} else {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_sw", frm.doc.software);
// 	}

// });


// cur_frm.set_query("items", "software", function (doc, cdt, cdn) {
// 	var d = locals[cdt][cdn];
// 	return {
// 		filters: [
// 			['Item', 'item_group', '=', d.group_code]
// 		]
// 	}
// });


// frappe.ui.form.on('Man Power', {
// 	man_power_remove: function (frm) {
// 		getFinalTotals(frm, "_manpower", frm.doc.man_power);
// 	},
// 	cost_price: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_manpower", frm.doc.man_power);
// 	},
// 	months: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_manpower", frm.doc.man_power);

// 	},
// 	quantity: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_manpower", frm.doc.man_power);

// 	},
// 	total_cost_price: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_manpower", frm.doc.man_power);

// 	},
// 	markup: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_manpower", frm.doc.man_power);

// 	},
// 	overhead_value: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_manpower", frm.doc.man_power);
// 	},
// 	employee: function (frm, cdt, cdn) {
// 		// var d = locals[cdt][cdn];
// 		// if (!d.designation & d.employee != "") {
// 		// 	frappe.model.set_value(cdt, cdn, "employee", "");
// 		// 	frappe.throw('Please Specify A Designation');

// 		// }
// 		// frappe.call({
// 		// 	method: "pmo.project_services.doctype.project_quotation.project_quotation.get_basic_salary",
// 		// 	args: {
// 		// 		employee: d.employee
// 		// 	},
// 		// 	callback: function (data) {
// 		// 		frappe.model.set_value(cdt, cdn, "cost_price", data.message);
// 		// 	}
// 		// });
// 		// calculateTechnicalServices(frm, cdt, cdn, "_manpower", frm.doc.man_power);
// 	},
// 	designation: function (frm, cdt, cdn) {
// 		// var d = locals[cdt][cdn];
// 		// if (d.designation && d.designation != "" && d.designation != undefined) {
// 		// 	frappe.model.set_value(cdt, cdn, "employee", "");

// 		// }
// 		// calculateTechnicalServices(frm, cdt, cdn, "_manpower", frm.doc.man_power);
// 	}



// });

// cur_frm.set_query("employee", 'man_power', function (doc, cdt, cdn) {
// 	var d = locals[cdt][cdn];
// 	return {
// 		"filters": {
// 			"designation": d.designation
// 		}
// 	}
// });


// frappe.ui.form.on('Support License Renew', {
// 	support_license_renew_remove: function (frm) {
// 		getFinalTotals(frm, "_support", frm.doc.support_license_renew);
// 	},
// 	months: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

// 	},
// 	cost_price: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		if (row.currency == 'SAR' && row.cost_price) {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
// 		} else {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

// 	},
// 	quantity: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

// 	},
// 	total_cost_price: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

// 	},
// 	markup: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

// 	},
// 	items: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.support_license_renew);
// 		ReCalculateAllData(frm, cdt, cdn, "_support", frm.doc.support_license_renew);

// 	},
// 	group_code: function (frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		if (d.group_code && d.group_code != "" && d.group_code != undefined) {
// 			frappe.model.set_value(cdt, cdn, "items", "");

// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_support", frm.doc.support_license_renew);
// 	},
// 	currency: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		if (row.currency == 'SAR' && row.cost_price) {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
// 		} else {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_support", frm.doc.support_license_renew);
// 	}

// });

// cur_frm.set_query("items", "support_license_renew", function (doc, cdt, cdn) {
// 	var d = locals[cdt][cdn];
// 	return {
// 		filters: [
// 			['Item', 'item_group', '=', d.group_code]
// 		]
// 	}
// });



// frappe.ui.form.on('Training', {
// 	training_remove: function (frm) {
// 		getFinalTotals(frm, "_training", frm.doc.training);
// 	},
// 	cost_price: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		if (row.currency == 'SAR' && row.cost_price) {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
// 		} else {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_training", frm.doc.training);

// 	},
// 	quantity: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_training", frm.doc.training);

// 	},
// 	total_cost_price: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_training", frm.doc.training);

// 	},
// 	markup: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_training", frm.doc.training);

// 	},
// 	items: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.training);
// 		ReCalculateAllData(frm, cdt, cdn, "_training", frm.doc.training);
// 	},
// 	group_code: function (frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		if (d.group_code && d.group_code != "" && d.group_code != undefined) {
// 			frappe.model.set_value(cdt, cdn, "items", "");

// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_training", frm.doc.training);
// 	},
// 	currency: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		if (row.currency == 'SAR' && row.cost_price) {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price);
// 		} else {
// 			frappe.model.set_value(cdt, cdn, "sar_cost_price", row.cost_price * 3.75);
// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_training", frm.doc.training);
// 	}

// });

// cur_frm.set_query("items", "training", function (doc, cdt, cdn) {
// 	var d = locals[cdt][cdn];
// 	return {
// 		filters: [
// 			['Item', 'item_group', '=', d.group_code]
// 		]
// 	}
// });

// frappe.ui.form.on('Expenses', {
// 	expenses_remove: function (frm) {
// 		getFinalTotals(frm, "_expenses", frm.doc.expenses);
// 	},
// 	cost_price: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_expenses", frm.doc.expenses);
// 	},
// 	quantity: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_expenses", frm.doc.expenses);

// 	},
// 	total_cost_price: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_expenses", frm.doc.expenses);

// 	},
// 	markup: function (frm, cdt, cdn) {
// 		ReCalculateAllData(frm, cdt, cdn, "_expenses", frm.doc.expenses);

// 	},
// 	items: function (frm, cdt, cdn) {
// 		var row = locals[cdt][cdn];
// 		get_item_price(frm, cdt, cdn, row.items, "cost_price", frm.doc.expenses);

// 	},
// 	group_code: function (frm, cdt, cdn) {
// 		var d = locals[cdt][cdn];
// 		if (d.group_code && d.group_code != "" && d.group_code != undefined) {
// 			frappe.model.set_value(cdt, cdn, "items", "");

// 		}
// 		ReCalculateAllData(frm, cdt, cdn, "_expenses", frm.doc.expenses);
// 	},



// });

// cur_frm.set_query("items", "expenses", function (doc, cdt, cdn) {
// 	var d = locals[cdt][cdn];
// 	return {
// 		filters: [
// 			['Item', 'item_group', '=', d.group_code]
// 		]
// 	}
// });