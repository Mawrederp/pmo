// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Billing Control', {
	// validate: function(frm) {
	// 	arr=[]
	// 	for(row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
	// 			if(cur_frm.doc.project_payment_schedule_control[row].invoice == 1){
	// 				arr.push(cur_frm.doc.project_payment_schedule_control[row].name)
	// 			}
	// 	}
	// 	console.log(arr.length)

	// },
	refresh: function(frm) {
		frm.add_custom_button(__("Make Invoice"), function () {
			// items = []
			for(row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
				if(cur_frm.doc.project_payment_schedule_control[row].invoice == 1){
					// items.push(cur_frm.doc.project_payment_schedule_control[row].scope_item)
					var scope_item = cur_frm.doc.project_payment_schedule_control[row].scope_item
					if(scope_item){
						scope_item=scope_item
					}else{
						scope_item=''
					}

					var project_name = cur_frm.doc.project_name
					if(project_name){
						project_name=project_name
					}else{
						project_name=''
					}

					var items_value = cur_frm.doc.project_payment_schedule_control[row].items_value
					if(items_value){
						items_value=items_value
					}else{
						items_value=0
					}

					var billing_percentage = cur_frm.doc.project_payment_schedule_control[row].billing_percentage
					if(billing_percentage){
						billing_percentage=billing_percentage
					}else{
						billing_percentage=0
					}

					var due_date = ''
					if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Date'){
						due_date = cur_frm.doc.project_payment_schedule_control[row].when
					}else if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Period'){
						due_date = cur_frm.doc.project_payment_schedule_control[row].to_date
					}

					var description_when = cur_frm.doc.project_payment_schedule_control[row].description_when
					if(description_when){
						description_when=description_when
					}else{
						description_when=''
					}

					var vat_value = cur_frm.doc.project_payment_schedule_control[row].vat_value
					if(vat_value){
						vat_value=vat_value
					}else{
						vat_value=0
					}

					frappe.call({
			            "method": "make_invoice",
			            doc: cur_frm.doc,
			            args: { "scope_item": scope_item,"project_name": project_name,
			            		"items_value": items_value,"billing_percentage": billing_percentage,
			            		"due_date": due_date,"description_when":description_when,"vat_value":vat_value},
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
