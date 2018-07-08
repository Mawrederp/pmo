// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('General Pricing', {
    vat_percent: function(frm){
        cur_frm.set_value("vat_value",(cur_frm.doc.selling_price * cur_frm.doc.vat_percent) /100)
        cur_frm.set_value("selling_price_risk",cur_frm.doc.vat_value + cur_frm.doc.selling_price)

        
        
    }
});