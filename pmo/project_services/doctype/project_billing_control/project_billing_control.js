// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Billing Control', {
	refresh: function(frm) {
		frm.add_custom_button(__("Make Invoice"), function () {
			// items = []
			for(row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
				if(cur_frm.doc.project_payment_schedule_control[row].invoice == 1){
					// items.push(cur_frm.doc.project_payment_schedule_control[row].scope_item)
					var scope_item = cur_frm.doc.project_payment_schedule_control[row].scope_item
					var project_name = cur_frm.doc.project_name
					var items_value = cur_frm.doc.project_payment_schedule_control[row].items_value
					var billing_percentage = cur_frm.doc.project_payment_schedule_control[row].billing_percentage
					frappe.call({
			            "method": "make_invoice",
			            doc: cur_frm.doc,
			            args: { "scope_item": scope_item,"project_name": project_name,
			            		"items_value": items_value,"billing_percentage": billing_percentage },
			            callback: function (r) {
		                    console.log(r.message)
		                }
			        });

				}
			}


    	});
	},
	project_name: function(frm) {
		if(cur_frm.doc.project_name){
			cur_frm.doc.project_payment_schedule_control = []
			frappe.model.with_doc("Project Initiation", frm.doc.project_name, function() {
		        var tabletransfer= frappe.model.get_doc("Project Initiation", frm.doc.project_name)
		        frm.doc.project_payment_schedule_control = []
	            frm.refresh_field("project_payment_schedule_control");
		        $.each(tabletransfer.project_payment_schedule, function(index, row){
		            d = frm.add_child("project_payment_schedule_control");
		            d.scope_item = row.scope_item;
		            d.from_date = row.from_date;
		            d.items_value = row.items_value;
		            d.billing_percentage = row.billing_percentage;
		            d.number_of_invoices = row.number_of_invoices;
		            d.vat = row.vat;
		            d.vat_value = row.vat_value;
		            d.total_billing_value = row.total_billing_value;
		            d.remaining_billing_value = row.remaining_billing_value;
		            d.remaining_billing_percent = row.remaining_billing_percent;
		            d.date_period = row.date_period;
		            d.to_date = row.to_date;
		            d.billing_value = row.billing_value;
		            d.when = row.when;
		            d.description_when = row.description_when;
		            frm.refresh_field("project_payment_schedule_control");
		        });
		    })
		}
	}
});
