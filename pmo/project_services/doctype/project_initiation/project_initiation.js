// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

function refresh_general_pricing(frm) {
    frm.clear_table("project_financial_detail");
    for (let i = 0; i <= 15; i++) {
        if ((frm.doc["section_name_" + i] != undefined || "" || frm.doc["cost_" + i] != 0 ||
                frm.doc["selling_price_" + i] != 0 || frm.doc["risk_contingency_" + i] != 0)) {

            var d = frm.add_child("project_financial_detail");

            d.scope_item = frm.doc["section_name_" + i];

            d.cost_price = frm.doc["cost_" + i];
            d.selling_price = frm.doc["selling_price_" + i];
            d.additions_value = frm.doc["risk_contingency_" + i];
            d.final_selling_price = frm.doc["total_selling_price_" + i];
            d.profit = frm.doc["profit_" + i];

        }

    }
    frm.script_manager.trigger("final_selling_price", d.doctype, d.name);
    frm.refresh_field("project_financial_detail");
}

frappe.ui.form.on('Project Initiation', {
    refresh_button: function (frm, cdt, cdn) {
        for (let index = 0; index <= 15; index++) {
            frm.refresh_field("section_name_" + index);
            frm.script_manager.trigger("cost_", cdt, cdn);
        }


        refresh_general_pricing(frm);


    },
    onload: function (frm, cdt, cdn) {
        if (frm.doc.project_quotation === undefined || !frm.doc.project_quotation) {
            frm.set_value("project_quotation", frm.doc.name);
            if (frm.doc.general_pricing === undefined || !frm.doc.general_pricing) {
                frm.set_value("general_pricing", frm.doc.name);
            }
            frappe.model.with_doc("Project Quotation", frm.doc.project_quotation, function () {
                var table_quotation = frappe.model.get_doc("Project Quotation", frm.doc.project_quotation);
                // frm.doc.general_pricing = table_quotation;

                // frm.refresh_field("general_pricing");
                for (let i = 0; i <= 15; i++) {
                    frm.clear_table("resources_details_" + i);
                    $.each(table_quotation["resources_details_" + i], function (index, row) {
                        var d = frm.add_child("resources_details_" + i);
                        d.group_code = row.group_code;
                        d.resources = row.resources;
                        d.cost_price = row.cost_price;
                        d.months = row.months;
                        d.resources_name = row.resources_name;
                        d.quantity = row.quantity;
                        d.overhead_expenses = row.overhead_expenses;
                        frm.refresh_field("resources_details_" + i);
                    });
                    frm.clear_table("items_details_" + i);
                    $.each(table_quotation["items_details_" + i], function (index, row) {
                        var d = frm.add_child("items_details_" + i);

                        var items_table_values = ["group_code", "cost_price", "items",
                            "quantity", "sar_cost_price", "cost_price_unit",
                            "selling_price_unit", "total_cost_price",
                            "total_selling_price", "currency", "tawaris_services",
                            "cost_price_ts", "selling_price_ts", "total_cost",
                            "profit", "risk", "contingency",
                            "selling_price", "markup_follow", "margin",
                            "final_selling_price", "markup", "time_unit",
                            "time_unit_services"
                        ];

                        for (let index = 0; index < items_table_values.length; index++) {
                            d[items_table_values[index]] = 0;

                        }
                        for (let index = 0; index < items_table_values.length; index++) {
                            d[items_table_values[index]] = row[items_table_values[index]];

                        }
                        frm.refresh_field("items_details_" + i);
                    });
                    var section_outer_values = ["section_name", "total_overhead_expenses", "cost", "selling_price", "risk_contingency", "total_selling_price", "profit", "markup", "margin"]
                    for (let index = 0; index < section_outer_values.length; index++) {
                        frm.doc[section_outer_values[index] + "_" + i] = 0;
                    }

                    for (let index = 0; index < section_outer_values.length; index++) {
                        frm.doc[section_outer_values[index] + "_" + i] = table_quotation[section_outer_values[index] + "_" + i];
                        if (frm.doc[section_outer_values[index] + "_" + i] != "") {
                            frm.refresh_field(section_outer_values[index] + "_" + i)
                        }
                    }



                }
            })
            cur_frm.doc.project_financial_detail = []
            frappe.model.with_doc("General Pricing", frm.doc.general_pricing, function () {
                var tabletransfer = frappe.model.get_doc("General Pricing", frm.doc.general_pricing)
                // frm.set_value("project_quotation", tabletransfer.project_q)
                frm.doc.project_financial_detail = []
                frm.refresh_field("project_financial_detail");
                $.each(tabletransfer.project_quotation, function (index, row) {
                    var d = frm.add_child("project_financial_detail");
                    d.scope_item = row.items;
                    d.selling_price = row.selling_price;
                    d.cost_price = row.total_cost_price;
                    d.additions_value = row.risk_contingency;
                    d.final_selling_price = row.total_selling_price;
                    d.profit = row.profit;
                    frm.refresh_field("project_financial_detail");
                });


            })
            cur_frm.save();
        }

        // var total = 0;
        // $.each(frm.doc.project_financial_detail || [], function (i, d) {
        //     total += flt(d.profit);
        // });
        // frm.set_value("total_profit", total);

        // if((cur_frm.doc.total_cost_price+cur_frm.doc.total_risk)!=0){
        //     frm.set_value("project_markup_percent", (cur_frm.doc.total_profit/(cur_frm.doc.total_cost_price+cur_frm.doc.total_risk))*100);
        // }
        // if(cur_frm.doc.total_final_selling_price!=0){
        //     frm.set_value("project_margin_percent", (cur_frm.doc.total_profit/cur_frm.doc.total_final_selling_price)*100);
        // }

    },
    total_billing_vat: function (frm) {
    	if(cur_frm.doc.total_final_selling_price && cur_frm.doc.total_final_selling_price_with_vat!=0){
        	cur_frm.set_value("overall_project_billing_percent", (cur_frm.doc.total_billing_vat/cur_frm.doc.total_final_selling_price_with_vat)*100);
    	}
    },
    profit_0: function (frm) {
        var markup_0 = 0;
        var margin_0 = 0
        if (cur_frm.doc.profit_0 && cur_frm.doc.profit_0 != 0) {
            if (cur_frm.doc.cost_0 && cur_frm.doc.risk_contingency_0) {
                markup_0 = cur_frm.doc.profit_0 / (cur_frm.doc.cost_0 + cur_frm.doc.risk_contingency_0)
            }
            if (cur_frm.doc.total_selling_price_0) {
                margin_0 = cur_frm.doc.profit_0 / cur_frm.doc.total_selling_price_0
            }

        }
        cur_frm.set_value("markup_0", Math.round(markup_0 * 100));
        cur_frm.set_value("margin_0", Math.round(margin_0 * 100));
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
        var markup_3 = cur_frm.doc.profit_3 / (cur_frm.doc.cost_3 + cur_frm.doc.risk_contingency_3)
        var margin_3 = cur_frm.doc.profit_3 / cur_frm.doc.total_selling_price_3
        cur_frm.set_value("markup_3", Math.round(markup_3 * 100));
        cur_frm.set_value("margin_3", Math.round(margin_3 * 100));
    },
    profit_4: function (frm) {
        var markup_4 = cur_frm.doc.profit_4 / (cur_frm.doc.cost_4 + cur_frm.doc.risk_contingency_4)
        var margin_4 = cur_frm.doc.profit_4 / cur_frm.doc.total_selling_price_4
        cur_frm.set_value("markup_4", Math.round(markup_4 * 100));
        cur_frm.set_value("margin_4", Math.round(margin_4 * 100));
    },
    profit_5: function (frm) {
        var markup_5 = cur_frm.doc.profit_5 / (cur_frm.doc.cost_5 + cur_frm.doc.risk_contingency_5)
        var margin_5 = cur_frm.doc.profit_5 / cur_frm.doc.total_selling_price_5
        cur_frm.set_value("markup_5", Math.round(markup_5 * 100));
        cur_frm.set_value("margin_5", Math.round(margin_5 * 100));
    },
    profit_6: function (frm) {
        var markup_6 = cur_frm.doc.profit_6 / (cur_frm.doc.cost_6 + cur_frm.doc.risk_contingency_6)
        var margin_6 = cur_frm.doc.profit_6 / cur_frm.doc.total_selling_price_6
        cur_frm.set_value("markup_6", Math.round(markup_6 * 100));
        cur_frm.set_value("margin_6", Math.round(margin_6 * 100));
    },
    profit_7: function (frm) {
        var markup_7 = cur_frm.doc.profit_7 / (cur_frm.doc.cost_7 + cur_frm.doc.risk_contingency_7)
        var margin_7 = cur_frm.doc.profit_7 / cur_frm.doc.total_selling_price_7
        cur_frm.set_value("markup_7", Math.round(markup_7 * 100));
        cur_frm.set_value("margin_7", Math.round(margin_7 * 100));
    },
    profit_8: function (frm) {
        var markup_8 = cur_frm.doc.profit_8 / (cur_frm.doc.cost_8 + cur_frm.doc.risk_contingency_8)
        var margin_8 = cur_frm.doc.profit_8 / cur_frm.doc.total_selling_price_8
        cur_frm.set_value("markup_8", Math.round(markup_8 * 100));
        cur_frm.set_value("margin_8", Math.round(margin_8 * 100));
    },
    profit_9: function (frm) {
        var markup_9 = cur_frm.doc.profit_9 / (cur_frm.doc.cost_9 + cur_frm.doc.risk_contingency_9)
        var margin_9 = cur_frm.doc.profit_9 / cur_frm.doc.total_selling_price_9
        cur_frm.set_value("markup_9", Math.round(markup_9 * 100));
        cur_frm.set_value("margin_9", Math.round(margin_9 * 100));
    },
    profit_10: function (frm) {
        var markup_10 = cur_frm.doc.profit_10 / (cur_frm.doc.cost_10 + cur_frm.doc.risk_contingency_10)
        var margin_10 = cur_frm.doc.profit_10 / cur_frm.doc.total_selling_price_10
        cur_frm.set_value("markup_10", Math.round(markup_10 * 100));
        cur_frm.set_value("margin_10", Math.round(margin_10 * 100));
    },
    profit_11: function (frm) {
        var markup_11 = cur_frm.doc.profit_11 / (cur_frm.doc.cost_11 + cur_frm.doc.risk_contingency_11)
        var margin_11 = cur_frm.doc.profit_11 / cur_frm.doc.total_selling_price_11
        cur_frm.set_value("markup_11", Math.round(markup_11 * 100));
        cur_frm.set_value("margin_11", Math.round(margin_11 * 100));
    },
    profit_12: function (frm) {
        var markup_12 = cur_frm.doc.profit_12 / (cur_frm.doc.cost_12 + cur_frm.doc.risk_contingency_12)
        var margin_12 = cur_frm.doc.profit_12 / cur_frm.doc.total_selling_price_12
        cur_frm.set_value("markup_12", Math.round(markup_12 * 100));
        cur_frm.set_value("margin_12", Math.round(margin_12 * 100));
    },
    profit_13: function (frm) {
        var markup_13 = cur_frm.doc.profit_13 / (cur_frm.doc.cost_13 + cur_frm.doc.risk_contingency_13)
        var margin_13 = cur_frm.doc.profit_13 / cur_frm.doc.total_selling_price_13
        cur_frm.set_value("markup_13", Math.round(markup_13 * 100));
        cur_frm.set_value("margin_13", Math.round(margin_13 * 100));
    },
    profit_14: function (frm) {
        var markup_14 = cur_frm.doc.profit_14 / (cur_frm.doc.cost_14 + cur_frm.doc.risk_contingency_14)
        var margin_14 = cur_frm.doc.profit_14 / cur_frm.doc.total_selling_price_14
        cur_frm.set_value("markup_14", Math.round(markup_14 * 100));
        cur_frm.set_value("margin_14", Math.round(margin_14 * 100));
    },
    profit_15: function (frm) {
        var markup_15 = cur_frm.doc.profit_15 / (cur_frm.doc.cost_15 + cur_frm.doc.risk_contingency_15)
        var margin_15 = cur_frm.doc.profit_15 / cur_frm.doc.total_selling_price_15
        cur_frm.set_value("markup_15", Math.round(markup_15 * 100));
        cur_frm.set_value("margin_15", Math.round(margin_15 * 100));
    },
    vat: function (frm) {
        cur_frm.set_value("vat_value", cur_frm.doc.total_final_selling_price*(cur_frm.doc.vat/100));
    },
    vat_value: function (frm) {
        cur_frm.set_value("total_final_selling_price_with_vat", cur_frm.doc.total_final_selling_price+cur_frm.doc.vat_value);
    },
    total_final_selling_price_with_vat: function (frm) {
        cur_frm.set_value("total_final_selling_price_with_vat", cur_frm.doc.total_final_selling_price+cur_frm.doc.vat_value);

        if(cur_frm.doc.total_final_selling_price && cur_frm.doc.total_final_selling_price_with_vat!=0){
        	cur_frm.set_value("overall_project_billing_percent", (cur_frm.doc.total_billing_vat/cur_frm.doc.total_final_selling_price_with_vat)*100);
    	}
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


        refresh_general_pricing(frm);


        var grand_total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            grand_total += flt(d.additions_value);
        });
        frm.set_value("total_risk", grand_total);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.selling_price);
        });
        frm.set_value("general_total_selling_price", total);

        // var total = 0;
        // $.each(frm.doc.project_financial_detail || [], function (i, d) {
        //     total += flt(d.profit);
        // });
        // frm.set_value("total_profit", total);

        cur_frm.set_value("vat_value", cur_frm.doc.total_final_selling_price*(cur_frm.doc.vat/100));

        cur_frm.set_value("total_final_selling_price_with_vat", cur_frm.doc.total_final_selling_price+cur_frm.doc.vat_value);

        if(cur_frm.doc.total_final_selling_price && cur_frm.doc.total_final_selling_price_with_vat!=0){
        	cur_frm.set_value("overall_project_billing_percent", (cur_frm.doc.total_billing_vat/cur_frm.doc.total_final_selling_price_with_vat)*100);
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

var resources_details_properties = {
    cost_price: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "overhead_expenses", 0);

        if (d.cost_price && d.quantity && d.months) {
            var total = ((d.cost_price * 1.45) * d.months) * d.quantity
            frappe.model.set_value(cdt, cdn, "overhead_expenses", total);
        }
    },
    quantity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "overhead_expenses", 0);

        if (d.cost_price && d.quantity && d.months) {
            var total = ((d.cost_price * 1.45) * d.months) * d.quantity
            frappe.model.set_value(cdt, cdn, "overhead_expenses", total);
        }
    },
    months: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        // frappe.model.set_value(cdt, cdn, "overhead_expenses", 0);

        if (d.cost_price && d.quantity && d.months) {
            var total = ((d.cost_price * 1.45) * d.months) * d.quantity
            frappe.model.set_value(cdt, cdn, "overhead_expenses", total);
        }
    },
    group_code: function (frm, cdt, cdn) {
        frappe.model.set_value(cdt, cdn, "resources", "");
    }

}
for (let index = 0; index <= 15; index++) {
    resources_details_properties["resources_details_" + index + "_remove"] = function (frm) {
        if (frm.doc["resources_details_" + index].length == 0) {
            frm.set_value("total_overhead_expenses_" + index, 0);

        }
    }

}
frappe.ui.form.on('Resources Details', resources_details_properties);



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
                } else {
                    frappe.model.set_value(cdt, cdn, "tawaris_services", 0);

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
        frappe.model.set_value(cdt, cdn, "cost_price_unit", 0);

        if (d.sar_cost_price && d.quantity) {
            var total = d.sar_cost_price * d.quantity
            frappe.model.set_value(cdt, cdn, "cost_price_unit", total);
        }
    },
    quantity: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "cost_price_unit", 0);

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
        frappe.model.set_value(cdt, cdn, "markup_follow", 0);

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
        frappe.model.set_value(cdt, cdn, "selling_price_unit", 0);
        frappe.model.set_value(cdt, cdn, "total_cost_price", 0);

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
        frappe.model.set_value(cdt, cdn, "selling_price_unit", 0);
        frappe.model.set_value(cdt, cdn, "selling_price_ts", 0);

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
        frappe.model.set_value(cdt, cdn, "total_cost_price", 0);
        frappe.model.set_value(cdt, cdn, "total_selling_price", 0);

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
        frappe.model.set_value(cdt, cdn, "total_selling_price", 0);

        if (d.selling_price_unit && d.time_unit) {
            var total = d.selling_price_unit * d.time_unit
            frappe.model.set_value(cdt, cdn, "total_selling_price", total);
        }
        frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
    },
    tawaris_services: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "cost_price_ts", 0);
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
        frappe.model.set_value(cdt, cdn, "selling_price_ts", 0);
        frappe.model.set_value(cdt, cdn, "total_cost", 0);

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
        frappe.model.set_value(cdt, cdn, "total_cost", 0);
        if (d.total_cost_price && d.cost_price_ts) {
            var total = d.total_cost_price + d.cost_price_ts
            frappe.model.set_value(cdt, cdn, "total_cost", total);
        }
        frappe.model.set_value(cdt, cdn, "total_cost", d.total_cost_price + d.cost_price_ts);
        frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
    },
    total_selling_price: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "selling_price", 0);
        if (d.total_selling_price && d.selling_price_ts) {
            var total = d.total_selling_price + d.selling_price_ts
            frappe.model.set_value(cdt, cdn, "selling_price", total);
        }
        frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
        frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
    },
    selling_price_ts: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "selling_price", 0);
        if (d.total_selling_price && d.selling_price_ts) {
            var total = d.total_selling_price + d.selling_price_ts
            frappe.model.set_value(cdt, cdn, "selling_price", total);
        }
        frappe.model.set_value(cdt, cdn, "selling_price", d.total_selling_price + d.selling_price_ts);
    },
    total_cost: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "profit", 0);
        frappe.model.set_value(cdt, cdn, "contingency", 0);

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
        frappe.model.set_value(cdt, cdn, "profit", 0);
        frappe.model.set_value(cdt, cdn, "final_selling_price", 0);

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
        frappe.model.set_value(cdt, cdn, "final_selling_price", 0);

        if (d.contingency && d.selling_price) {
            var total = d.contingency + d.selling_price
            frappe.model.set_value(cdt, cdn, "final_selling_price", total);
        }
        frappe.model.set_value(cdt, cdn, "final_selling_price", d.contingency + d.selling_price);
    },
    profit: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "margin", 0);
        if (d.profit && d.final_selling_price && !(d.final_selling_price == 0 || isNaN(d.final_selling_price))) {
            var total = Math.round((d.profit / d.final_selling_price) * 100)
            frappe.model.set_value(cdt, cdn, "margin", total);
        }
    },
    final_selling_price: function (frm, cdt, cdn) {
        var d = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "margin", 0);
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




frappe.ui.form.on("Resources Details", "overhead_expenses", function (frm, cdt, cdn) {


    for (let index = 0; index <= 15; index++) {
        var grand_total = 0;
        $.each(frm.doc["resources_details_" + index] || [], function (i, d) {
            grand_total += flt(d.overhead_expenses);
        });
        frm.set_value("total_overhead_expenses_" + index, grand_total);

    }


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
    var parentfield = locals[cdt][cdn].parentfield;
    var parentfield_id = parentfield[parentfield.length - 1]

    var grand_total = 0;
    $.each(frm.doc["items_details_" + parentfield_id] || [], function (i, d) {
        grand_total += flt(d.final_selling_price);
    });
    frm.set_value("total_selling_price_" + parentfield_id, grand_total);

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

    frappe.model.set_value("Items Details", "items_details_1", 'tawaris_services', 0);


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

frappe.ui.form.on('Project Initiation', {
    section_name_0: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_1: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_2: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_3: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_4: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_5: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_6: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_7: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_8: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_9: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_10: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_11: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_12: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_13: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_14: function (frm) {
        refresh_general_pricing(frm);
    },
    section_name_15: function (frm) {
        refresh_general_pricing(frm);
    },
    refresh: function (frm) {
        frm.add_custom_button(__("Project Initiation"), function () {

        });


        frm.add_custom_button(__("Project Planning"), function () {
            frappe.call({
                "method": "existing_project_planning",
                doc: cur_frm.doc,
                callback: function (r) {
                    frappe.set_route("Form", "Project Planning", r.message);
                }
            });

        });


        frm.add_custom_button(__("Project Implementation, Monitoring and Controlling"), function () {
            frappe.call({
                "method": "existing_project_controlling",
                doc: cur_frm.doc,
                callback: function (r) {
                    frappe.set_route("Form", "Project Implementation Monitoring and Controlling", r.message);
                }
            });

        });


        frm.add_custom_button(__("Project Closure"), function () {
            frappe.call({
                "method": "existing_project_closure",
                doc: cur_frm.doc,
                callback: function (r) {
                    frappe.set_route("Form", "Project Closure", r.message);
                }
            });

        });

        $(".layout-main-section .form-inner-toolbar button:nth-child(1)").removeClass("btn-default");
        $('.layout-main-section .form-inner-toolbar :nth-child(1)').before('<b><p style="text-align: center;font-size: 25px;">Project Phases</p></b>');
        $('.layout-main-section-wrapper .layout-main-section .form-inner-toolbar').after('<style>.layout-main-section-wrapper .layout-main-section .form-inner-toolbar{height: 100px !important;}</style>');
        $('.layout-main-section-wrapper .layout-main-section .form-inner-toolbar').after('<style>.layout-main-section-wrapper .layout-main-section .form-inner-toolbar button:nth-child(n+1){float: left !important;}.layout-main-section-wrapper .layout-main-section .form-inner-toolbar button{font-weight: bold!important;}</style>');


    },
    onload: function (frm) {
        cur_frm.refresh_fields(["workflow_state"]);
    },
    workflow_state: function (frm) {
        cur_frm.refresh_fields(["workflow_state"]);
    },
    project_sponsor: function (frm) {
        if (cur_frm.doc.project_sponsor) {
            frm.set_value("project_sponsor_ch", cur_frm.doc.project_sponsor);
            frm.set_value("project_sponsor_name_ch", cur_frm.doc.project_sponsor_name);
            frm.set_value("employee_tawari_sponsor", cur_frm.doc.project_sponsor_name);
        }
    },
    project_owner: function (frm) {
        if (cur_frm.doc.project_owner) {
            frm.set_value("project_owner_ch", cur_frm.doc.project_owner);
            frm.set_value("project_owner_name_ch", cur_frm.doc.project_owner_name);
            frm.set_value("employee_tawari_owner", cur_frm.doc.project_owner_name);
        }
    },
    project_manager: function (frm) {
        if (cur_frm.doc.project_manager) {
            frm.set_value("project_managr_ch", cur_frm.doc.project_manager);
            frm.set_value("project_manager_name_ch", cur_frm.doc.project_manager_name);
        }
    },
    account: function (frm) {
        if (cur_frm.doc.account) {
            frm.set_value("account_ch", cur_frm.doc.account);
        }
    },
    customer: function (frm) {
        if (cur_frm.doc.customer) {
            frm.set_value("customer_ch", cur_frm.doc.customer);
        }
    },
    customer_project_manager: function (frm) {
        if (cur_frm.doc.customer_project_manager) {
            frm.set_value("customer_project_manager_ch", cur_frm.doc.customer_project_manager);
        }
    },
    customer_project_sponsor: function (frm) {
        if (cur_frm.doc.customer_project_sponsor) {
            frm.set_value("customer_project_sponsor_ch", cur_frm.doc.customer_project_sponsor);
            frm.set_value("employee_client_sponsor", cur_frm.doc.customer_project_sponsor);
        }
    },
    customer_project_owner: function (frm) {
        if (cur_frm.doc.customer_project_owner) {
            frm.set_value("customer_project_owner_ch", cur_frm.doc.customer_project_owner);
        }
    },
    po_number: function (frm) {
        if (cur_frm.doc.po_number) {
            frm.set_value("po_number_ch", cur_frm.doc.po_number);
        }
    },
    po_date: function (frm) {
        if (cur_frm.doc.po_date) {
            frm.set_value("po_date_ch", cur_frm.doc.po_date);
        }
    },
    customer_department: function (frm) {
        if (cur_frm.doc.customer_department) {
            frm.set_value("customer_department_ch", cur_frm.doc.customer_department);
        }
    },
    start_date: function (frm) {
        if (cur_frm.doc.start_date) {
            frm.set_value("expected_start_date", cur_frm.doc.start_date);
        }
    },
    end_date: function (frm) {
        if (cur_frm.doc.end_date) {
            frm.set_value("expected_end_date", cur_frm.doc.end_date);
        }
    },
    employee: function (frm) {
        if (cur_frm.doc.employee) {
            frm.set_value("employee_ch", cur_frm.doc.employee);
        }
    },
    end_users: function (frm) {
        if (cur_frm.doc.end_users) {
            frm.set_value("end_users_ch", cur_frm.doc.end_users);
        }
    },
    concerned_department: function (frm) {
        if (cur_frm.doc.concerned_department) {
            frm.set_value("concerned_department_ch", cur_frm.doc.concerned_department);
        }
    },
    total_cost_price: function (frm) {

        var total_overall_profit = flt(cur_frm.doc.total_final_selling_price) - flt(cur_frm.doc.total_cost_price);
        frm.set_value("overall_project_profit", total_overall_profit);
        frm.set_value("overall_project_budget", cur_frm.doc.total_final_selling_price_with_vat);

        var total_overall_markup = flt(cur_frm.doc.overall_project_profit) / flt(cur_frm.doc.total_cost_price) * 100;
        frm.set_value("overall_project_markup", total_overall_markup);

        var total_overall_margin = flt(cur_frm.doc.overall_project_profit) / flt(cur_frm.doc.general_total_selling_price) * 100;
        frm.set_value("overall_project_margin", total_overall_margin);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.additions_value);
        });
        frm.set_value("total_risk", total);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.selling_price);
        });
        frm.set_value("general_total_selling_price", total);


        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.profit);
        });
        frm.set_value("total_profit", total);

        if((cur_frm.doc.total_cost_price+cur_frm.doc.total_risk)!=0){
            frm.set_value("project_markup_percent", (cur_frm.doc.total_profit/(cur_frm.doc.total_cost_price+cur_frm.doc.total_risk))*100);
        }

    },
    total_final_selling_price: function (frm) {

        var total_overall_profit = flt(cur_frm.doc.total_final_selling_price) - flt(cur_frm.doc.total_cost_price);
        frm.set_value("overall_project_profit", total_overall_profit);

        var total_overall_markup = flt(cur_frm.doc.overall_project_profit) / flt(cur_frm.doc.total_cost_price) * 100;
        frm.set_value("overall_project_markup", total_overall_markup);

        var total_overall_margin = flt(cur_frm.doc.overall_project_profit) / flt(cur_frm.doc.general_total_selling_price) * 100;
        frm.set_value("overall_project_margin", total_overall_margin);

        if(cur_frm.doc.total_final_selling_price && cur_frm.doc.total_final_selling_price!=0){
            frm.set_value("risk_contingency_percent", (cur_frm.doc.total_risk/cur_frm.doc.total_final_selling_price)*100);
        }

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.additions_value);
        });
        frm.set_value("total_risk", total);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.selling_price);
        });
        frm.set_value("general_total_selling_price", total);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.profit);
        });
        frm.set_value("total_profit", total);

        if(cur_frm.doc.total_final_selling_price!=0){
            frm.set_value("project_margin_percent", (cur_frm.doc.total_profit/cur_frm.doc.total_final_selling_price)*100);
        }
    },
    total_risk: function(frm){
        if(cur_frm.doc.total_final_selling_price && cur_frm.doc.total_final_selling_price!=0){
            frm.set_value("risk_contingency_percent", (cur_frm.doc.total_risk/cur_frm.doc.total_final_selling_price)*100);
        }

        if((cur_frm.doc.total_cost_price+cur_frm.doc.total_risk)!=0){
            frm.set_value("project_markup_percent", (cur_frm.doc.total_profit/(cur_frm.doc.total_cost_price+cur_frm.doc.total_risk))*100);
        }
    },
    total_final_selling_price_with_vat: function(frm){
        frm.set_value("overall_project_budget", cur_frm.doc.total_final_selling_price_with_vat);
    },
    total_profit: function(frm){
        if((cur_frm.doc.total_cost_price+cur_frm.doc.total_risk)!=0){
            frm.set_value("project_markup_percent", (cur_frm.doc.total_profit/(cur_frm.doc.total_cost_price+cur_frm.doc.total_risk))*100);
        }

        if(cur_frm.doc.total_final_selling_price!=0){
            frm.set_value("project_margin_percent", (cur_frm.doc.total_profit/cur_frm.doc.total_final_selling_price)*100);
        }
    },
    validate: function (frm) {

      

        cur_frm.refresh_fields(["workflow_state"]);

        var grand_total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            grand_total += flt(d.cost_price);
        });
        frm.set_value("total_cost_price", grand_total);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.final_selling_price);
        });
        frm.set_value("total_final_selling_price", total);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.additions_value);
        });
        frm.set_value("total_risk", total);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.selling_price);
        });
        frm.set_value("general_total_selling_price", total);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.profit);
        });
        frm.set_value("total_profit", total);

        var total_overall_profit = flt(cur_frm.doc.total_final_selling_price) - flt(cur_frm.doc.total_cost_price);
        frm.set_value("overall_project_profit", total_overall_profit);
        frm.set_value("overall_project_budget", cur_frm.doc.total_final_selling_price_with_vat);

        var total_overall_markup = flt(cur_frm.doc.overall_project_profit) / flt(cur_frm.doc.total_cost_price) * 100;
        frm.set_value("overall_project_markup", total_overall_markup);

        var total_overall_margin = flt(cur_frm.doc.overall_project_profit) / flt(cur_frm.doc.general_total_selling_price) * 100;
        frm.set_value("overall_project_margin", total_overall_margin);

        if(cur_frm.doc.total_final_selling_price && cur_frm.doc.total_final_selling_price!=0){
            frm.set_value("risk_contingency_percent", (cur_frm.doc.total_risk/cur_frm.doc.total_final_selling_price)*100);
        }

        var billing_total = 0;
        $.each(frm.doc.project_payment_schedule || [], function (i, d) {
            billing_total += flt(d.billing_value);
        });
        frm.set_value("total_billing", billing_total);

        var vat_value_total = 0;
        $.each(frm.doc.project_payment_schedule || [], function (i, d) {
            vat_value_total += flt(d.vat_value);
        });
        frm.set_value("total_project_vat_value", vat_value_total);

        var billing_total_vat = 0;
        $.each(frm.doc.project_payment_schedule || [], function (i, d) {
            billing_total_vat += flt(d.total_billing_value);
        });
        frm.set_value("total_billing_vat", billing_total_vat);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.additions_value);
        });
        frm.set_value("total_risk", total);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.selling_price);
        });
        frm.set_value("general_total_selling_price", total);

        var total = 0;
        $.each(frm.doc.project_financial_detail || [], function (i, d) {
            total += flt(d.profit);
        });
        frm.set_value("total_profit", total);

        if((cur_frm.doc.total_cost_price+cur_frm.doc.total_risk)!=0){
            frm.set_value("project_markup_percent", (cur_frm.doc.total_profit/(cur_frm.doc.total_cost_price+cur_frm.doc.total_risk))*100);
        }

        if(cur_frm.doc.total_final_selling_price!=0){
            frm.set_value("project_margin_percent", (cur_frm.doc.total_profit/cur_frm.doc.total_final_selling_price)*100);
        }

        frm.set_value("overall_project_budget", cur_frm.doc.total_final_selling_price_with_vat);

        if(cur_frm.doc.project_owner_name){
            frm.set_value("employee_tawari_owner", cur_frm.doc.project_owner_name);
        }
        if(cur_frm.doc.project_sponsor_name){
            frm.set_value("employee_tawari_sponsor", cur_frm.doc.project_sponsor_name);
        }
        if(cur_frm.doc.customer_project_sponsor){
            frm.set_value("employee_client_sponsor", cur_frm.doc.customer_project_sponsor);
        }

    }

});

cur_frm.cscript.custom_validate = function (frm) {
    var total_cost_price = 0;
    var final_selling_price = 0;
    var additions_value = 0;
    var selling_price = 0;
    var profit = 0;
    $.each(cur_frm.doc.project_financial_detail || [], function (i, d) {
        total_cost_price += flt(d.cost_price);
        final_selling_price += flt(d.final_selling_price);
        additions_value += flt(d.additions_value);
        selling_price += flt(d.selling_price);
        profit += flt(d.profit);
    });
    cur_frm.set_value("total_cost_price", total_cost_price);
    cur_frm.set_value("total_final_selling_price", final_selling_price);
    cur_frm.set_value("total_risk", additions_value);
    cur_frm.set_value("general_total_selling_price", selling_price);
    cur_frm.set_value("total_profit", profit);

}




frappe.ui.form.on("Project Financial Details", "cost_price", function (frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    var grand_total = 0;
    $.each(frm.doc.project_financial_detail || [], function (i, d) {
        grand_total += flt(d.cost_price);
    });
    frm.set_value("total_cost_price", grand_total);
});


frappe.ui.form.on("Project Financial Details", "final_selling_price", function (frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    var total = 0;
    $.each(frm.doc.project_financial_detail || [], function (i, d) {
        total += flt(d.final_selling_price);
    });
    frm.set_value("total_final_selling_price", total);
});


frappe.ui.form.on("Project Financial Details", "additions_value", function (frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    var total = 0;
    $.each(frm.doc.project_financial_detail || [], function (i, d) {
        total += flt(d.additions_value);
    });
    frm.set_value("total_risk", total);
});


frappe.ui.form.on("Project Financial Details", "selling_price", function (frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    var total = 0;
    $.each(frm.doc.project_financial_detail || [], function (i, d) {
        total += flt(d.selling_price);
    });
    frm.set_value("general_total_selling_price", total);
});


frappe.ui.form.on("Project Financial Details", "profit", function (frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    var total = 0;
    $.each(frm.doc.project_financial_detail || [], function (i, d) {
        total += flt(d.profit);
    });
    frm.set_value("total_profit", total);
});


frappe.ui.form.on("Project Payment Schedule", "billing_value", function (frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    var billing_total = 0;
    $.each(frm.doc.project_payment_schedule || [], function (i, d) {
        billing_total += flt(d.billing_value);
    });
    frm.set_value("total_billing", billing_total);
});

frappe.ui.form.on("Project Payment Schedule", "vat_value", function (frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    var vat_value_total = 0;
    $.each(frm.doc.project_payment_schedule || [], function (i, d) {
        vat_value_total += flt(d.vat_value);
    });
    frm.set_value("total_project_vat_value", vat_value_total);
});

frappe.ui.form.on("Project Payment Schedule", "total_billing_value", function (frm, cdt, cdn) {
    // code for calculate total and set on parent field.
    var billing_total_vat = 0;
    $.each(frm.doc.project_payment_schedule || [], function (i, d) {
        billing_total_vat += flt(d.total_billing_value);
    });
    frm.set_value("total_billing_vat", billing_total_vat);
});


frappe.ui.form.on('Project Financial Details', {
    selling_price: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "final_selling_price", 0);

        if (row.selling_price || row.additions_value) {
            frappe.model.set_value(cdt, cdn, "final_selling_price", row.selling_price + row.additions_value);
        }

    },
    additions_value: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "final_selling_price", 0);

        if (row.selling_price || row.additions_value) {
            frappe.model.set_value(cdt, cdn, "final_selling_price", row.selling_price + row.additions_value);
        }

        frappe.model.set_value(cdt, cdn, "profit", row.final_selling_price-(row.cost_price+row.additions_value));

        if((row.cost_price+row.additions_value)!=0){
            frappe.model.set_value(cdt, cdn, "markup", (row.profit/(row.cost_price+row.additions_value))*100);
        }

    },
    final_selling_price: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "profit", row.final_selling_price-(row.cost_price+row.additions_value));

        if(row.final_selling_price!=0){
            frappe.model.set_value(cdt, cdn, "margin", (row.profit/row.final_selling_price)*100);
        }
    },
    cost_price: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "profit", row.final_selling_price-(row.cost_price+row.additions_value));

        if((row.cost_price+row.additions_value)!=0){
            frappe.model.set_value(cdt, cdn, "markup", (row.profit/(row.cost_price+row.additions_value))*100);
        }
    },
    profit: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if((row.cost_price+row.additions_value)!=0){
            frappe.model.set_value(cdt, cdn, "markup", (row.profit/(row.cost_price+row.additions_value))*100);
        }

        if(row.final_selling_price!=0){
            frappe.model.set_value(cdt, cdn, "margin", (row.profit/row.final_selling_price)*100);
        }
    },
    adjustment: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "final_selling_price", row.selling_price+row.additions_value+row.adjustment);       
    }


})


cur_frm.set_query("scope_item", "project_payment_schedule", function (doc, cdt, cdn) {
    var row = locals[cdt][cdn];
    item_length = cur_frm.doc.project_financial_detail.length
    item = []
    cost = []
    for (var i = 0; i < item_length; i++) {
        item.push(cur_frm.doc.project_financial_detail[i].scope_item)
        cost.push(cur_frm.doc.project_financial_detail[i].final_selling_price)
    }
    // console.log(item)
    // console.log(cost)
    var d = locals[cdt][cdn];
    return {
        filters: [
            ['Project Items', 'name', 'in', item]
        ]
    }
});



frappe.ui.form.on('Project Payment Schedule', {
	validate: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];

		var billing_total = 0;
        $.each(frm.doc.project_payment_schedule || [], function (i, d) {
            if(d.scope_item==row.scope_item){
            	billing_total += flt(d.billing_value);
            }
        });
        frappe.model.set_value(cdt, cdn, "remaining_billing_value", row.items_value-(billing_total));

        if(row.items_value && row.items_value!=0){
	        frappe.model.set_value(cdt, cdn, "remaining_billing_percent", (row.remaining_billing_value/row.items_value)*100);
	    }        

    },
    scope_item: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];

        item_length = cur_frm.doc.project_financial_detail.length
        item = []
        cost = []
        for (var i = 0; i < item_length; i++) {
            item.push(cur_frm.doc.project_financial_detail[i].scope_item)
            cost.push(cur_frm.doc.project_financial_detail[i].final_selling_price)
        }
        frappe.model.set_value(cdt, cdn, "items_value", cost[item.indexOf(row.scope_item)]);

    },
    items_value: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "billing_value", 0);

        if (row.billing_percentage<=row.remaining_billing_percent && row.billing_percentage>=0) {
	        if (row.items_value && row.billing_percentage) {
	            frappe.model.set_value(cdt, cdn, "billing_value", row.billing_percentage / 100 * row.items_value);
	        }
	    }

        var billing_total = 0;
        $.each(frm.doc.project_payment_schedule || [], function (i, d) {
            if(d.scope_item==row.scope_item){
            	billing_total += flt(d.billing_value);
            }
        });
        frappe.model.set_value(cdt, cdn, "remaining_billing_value", row.items_value-(billing_total));

        if(row.items_value && row.items_value!=0){
	        frappe.model.set_value(cdt, cdn, "remaining_billing_percent", (row.remaining_billing_value/row.items_value)*100);
	    }

    },
    billing_percentage: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "billing_value", 0);

        if (row.billing_percentage<=row.remaining_billing_percent && row.billing_percentage>=0) {
	        if (row.items_value && row.billing_percentage) {
	            frappe.model.set_value(cdt, cdn, "billing_value", row.billing_percentage / 100 * row.items_value);
	        }
	    }

        if (row.billing_percentage>row.remaining_billing_percent && row.billing_percentage>=0) {
        	frappe.model.set_value(cdt, cdn, "billing_percentage", );
            frappe.call({
                "method": "remaining_billing_percent_msg",
                args: {
					'remaining_percent': row.remaining_billing_percent,
				},
                doc: cur_frm.doc
            });
        }

    },
    billing_value: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];

        if (row.vat && row.billing_value) {
            frappe.model.set_value(cdt, cdn, "vat_value", (row.vat/100)*row.billing_value);
        }
        if (row.vat_value && row.billing_value) {
            frappe.model.set_value(cdt, cdn, "total_billing_value", row.vat_value+row.billing_value);
        }

        var billing_total = 0;
        $.each(frm.doc.project_payment_schedule || [], function (i, d) {
            if(d.scope_item==row.scope_item){
            	billing_total += flt(d.billing_value);
            }
        });
        frappe.model.set_value(cdt, cdn, "remaining_billing_value", row.items_value-(billing_total));

    },
    vat: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];

        if (row.vat && row.billing_value) {
            frappe.model.set_value(cdt, cdn, "vat_value", (row.vat/100)*row.billing_value);
        }

    },
    vat_value: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];

        if (row.vat_value && row.billing_value) {
            frappe.model.set_value(cdt, cdn, "total_billing_value", row.vat_value+row.billing_value);
        }

    },
    remaining_billing_value: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.items_value && row.items_value!=0){
	        frappe.model.set_value(cdt, cdn, "remaining_billing_percent", (row.remaining_billing_value/row.items_value)*100);
	    }
    },


})



cur_frm.set_query("scope_item", "project_costing_schedule", function (doc, cdt, cdn) {
    var row = locals[cdt][cdn];
    item_length = cur_frm.doc.project_financial_detail.length
    item = []
    cost = []
    for (var i = 0; i < item_length; i++) {
        item.push(cur_frm.doc.project_financial_detail[i].scope_item)
        cost.push(cur_frm.doc.project_financial_detail[i].final_selling_price)
    }
    
    var d = locals[cdt][cdn];
    return {
        filters: [
            ['Project Items', 'name', 'in', item]
        ]
    }
});


frappe.ui.form.on('Project Costing Schedule', {
    type_of_cost: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        frappe.model.set_value(cdt, cdn, "scope_item", );
        frappe.model.set_value(cdt, cdn, "scope_item_cost_value", 0);
        frappe.model.set_value(cdt, cdn, "no_contracts", );
        frappe.model.set_value(cdt, cdn, "po_contract_extimated_cost", );
        frappe.model.set_value(cdt, cdn, "vendor", );
        frappe.model.set_value(cdt, cdn, "last_date", );        

        frappe.call({
            "method": "get_project_cost_value",
            doc: cur_frm.doc,
            args: {
                    'type_of_cost': row.type_of_cost,
                },
            callback: function (r) {
                if(r.message){
                    frappe.model.set_value(cdt, cdn, "project_cost_value", r.message);
                }
            }
        });


        if(row.type_of_cost=='External Expenses'){
            // var df = frappe.meta.get_docfield("Project Costing Schedule", 'vendor' , cur_frm.doc.name);
            // df.hidden = 0; 
            frm.fields_dict["project_costing_schedule"].grid.set_column_disp("vendor", true);
        }else{
            frm.fields_dict["project_costing_schedule"].grid.set_column_disp("vendor", false);
        }

    },
    scope_item: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        
        section_number = 0
        for(i=0;i<=15;i++){
            section = frm.doc["section_name_" + i];
            if(section == row.scope_item){
                section_number = i
            }
        }


        frappe.call({
            "method": "get_project_cost_value_item",
            doc: cur_frm.doc,
            args: {
                    'type_of_cost': row.type_of_cost,'section_number': section_number,
                },
            callback: function (r) {
                if(r.message){
                    frappe.model.set_value(cdt, cdn, "scope_item_cost_value", r.message);
                }
            }
        });
        

    },
    po_contract_extimated_cost: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.po_contract_extimated_cost>row.scope_item_cost_value){
        	frappe.model.set_value(cdt, cdn, "po_contract_extimated_cost", );
        	
        	frappe.call({
	            "method": "validate_po_contract_extimated_cost",
	            doc: cur_frm.doc
	        });

        }

    }

});

