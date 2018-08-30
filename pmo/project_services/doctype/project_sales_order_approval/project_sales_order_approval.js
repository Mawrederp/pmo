// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Sales Order Approval', {
	refresh: function(frm,cdt,cdn) {
		frm.add_custom_button(__("Make Sales Order"), function () {

			var description_when = cur_frm.doc.description_when
			if(description_when){
				description_when=description_when
			}else{
				description_when=''
			}


			frappe.call({
	            "method": "make_sales_order",
	            doc: cur_frm.doc,
	            args: { "description_when":description_when},
	            callback: function (r) {
                    console.log(r.message)
                    invoice_name = r.message
                    cur_frm.set_value("sales_order", invoice_name)
 						
					frappe.call({
			            "method": "updat_init_payment_table_invoice",
			            doc: cur_frm.doc,
			            args: {"sales_order":invoice_name},
			            callback: function (r) {
			            	if(r.message){
			            		console.log(r.message)
							}
		                }
			        });


                }
	        });



    	});


    	

	}
});
