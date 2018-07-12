// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('General Pricing', {
    vat_percent: function(frm){
        if(cur_frm.doc.total_selling_price * cur_frm.doc.vat_percent >= 0){
            cur_frm.set_value("vat_value",(cur_frm.doc.total_selling_price * cur_frm.doc.vat_percent) /100)
        }else{
            cur_frm.set_value("vat_value",(0))

        }
        cur_frm.set_value("selling_price_risk",cur_frm.doc.vat_value + cur_frm.doc.total_selling_price)
    },
    total_cost_price: function(frm){
        var total = cur_frm.doc.profit_amount/(cur_frm.doc.total_cost_price+cur_frm.doc.risk_contingency)
        cur_frm.set_value("total_markup", total)
    },
    total_selling_price: function(frm){
        var total = cur_frm.doc.profit_amount/total_selling_price
        cur_frm.set_value("total_margin", total)
    }
});