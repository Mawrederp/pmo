// Copyright (c) 2018, s and contributors
// For license information, please see license.txt
cur_frm.add_fetch('project_initiation','sales_order','sales_order');

frappe.ui.form.on('Project Sales Order Approval', {
	refresh: function(frm,cdt,cdn) {
		var df = frappe.meta.get_docfield("Project Payment Schedule","scope_item", cur_frm.doc.name);
    	df.read_only = 1;
    	var df = frappe.meta.get_docfield("Project Payment Schedule","billing_percentage", cur_frm.doc.name);
    	df.read_only = 1;
    	var df = frappe.meta.get_docfield("Project Payment Schedule","number_of_invoices", cur_frm.doc.name);
    	df.read_only = 1;
    	var df = frappe.meta.get_docfield("Project Payment Schedule","vat", cur_frm.doc.name);
    	df.read_only = 1;
    	var df = frappe.meta.get_docfield("Project Payment Schedule","date_period", cur_frm.doc.name);
    	df.read_only = 1;
    	var df = frappe.meta.get_docfield("Project Payment Schedule","from_date", cur_frm.doc.name);
    	df.read_only = 1;
    	var df = frappe.meta.get_docfield("Project Payment Schedule","to_date", cur_frm.doc.name);
    	df.read_only = 1;
    	var df = frappe.meta.get_docfield("Project Payment Schedule","when", cur_frm.doc.name);
    	df.read_only = 1;
    	var df = frappe.meta.get_docfield("Project Payment Schedule","description_when", cur_frm.doc.name);
    	df.read_only = 1;



    	if(cur_frm.doc.workflow_state=="Approved By CEO"){
			frm.add_custom_button(__("Make Sales Order"), function () {

				frappe.call({
		            "method": "make_sales_order",
		            doc: cur_frm.doc,
		            callback: function (r) {
	                    console.log(r.message)
	                    if(r.message){
		                    sales_order = r.message
		                    cur_frm.set_value("sales_order", sales_order)
		                    cur_frm.save()
	 					}
	                }
		        });

	    	});
		}





		// if(cur_frm.doc.workflow_state=="Approved by PMO Director"){
		// 	frm.add_custom_button(__("Make Sales Order"), function () {

		// 		var description_when = cur_frm.doc.description_when
		// 		if(description_when){
		// 			description_when=description_when
		// 		}else{
		// 			description_when=''
		// 		}


		// 		frappe.call({
		//             "method": "make_sales_order",
		//             doc: cur_frm.doc,
		//             args: { "description_when":description_when},
		//             callback: function (r) {
	 //                    console.log(r.message)
	 //                    invoice_name = r.message
	 //                    cur_frm.set_value("sales_order", invoice_name)
	 //                    cur_frm.save()

		// 				frappe.call({
		// 		            "method": "updat_init_payment_table_invoice",
		// 		            doc: cur_frm.doc,
		// 		            args: {"sales_order":invoice_name},
		// 		            callback: function (r) {
		// 		            	if(r.message){
		// 		            		console.log(r.message)
		// 						}
		// 	                }
		// 		        });

	 //                }
		//         });

	 //    	});
		// }



	}
});
