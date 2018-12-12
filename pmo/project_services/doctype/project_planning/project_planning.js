// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Planning', {
	refresh: function(frm) {
        
        frm.add_custom_button(__("Project Initiation"), function () {
        	frappe.call({
                "method": "existing_project_initiation",
                doc: cur_frm.doc,
                callback: function(r) {
                frappe.set_route("Form", "Project Initiation", r.message);
                }
            });
        });


        frm.add_custom_button(__("Project Planning"), function () {

        });


        frm.add_custom_button(__("Project Implementation, Monitoring and Controlling"), function () {
            frappe.call({
                "method": "existing_project_controlling",
                doc: cur_frm.doc,
                callback: function(r) {
                frappe.set_route("Form", "Project Implementation Monitoring and Controlling", r.message);
                }
            });

        });


        frm.add_custom_button(__("Project Closure"), function () {
            frappe.call({
                "method": "existing_project_closure",
                doc: cur_frm.doc,
                callback: function(r) {
                frappe.set_route("Form", "Project Closure", r.message);
                }
            });

        });

        $(".layout-main-section .form-inner-toolbar button:nth-child(2)").removeClass("btn-default");
        $('.layout-main-section .form-inner-toolbar :nth-child(1)').before('<b><p style="text-align: center;font-size: 25px;">Project Phases</p></b>');
        $('.layout-main-section-wrapper .layout-main-section .form-inner-toolbar').after('<style>.layout-main-section-wrapper .layout-main-section .form-inner-toolbar{height: 100px !important;}</style>');
        $('.layout-main-section-wrapper .layout-main-section .form-inner-toolbar').after('<style>.layout-main-section-wrapper .layout-main-section .form-inner-toolbar button:nth-child(n+1){float: left !important;}.layout-main-section-wrapper .layout-main-section .form-inner-toolbar button{font-weight: bold!important;}</style>');
        
        
	}
});


frappe.ui.form.on("Roles And Responsibilities", {
	party: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, 'name1', );

		frm.set_value("client_steering_name", );
		frm.set_value("client_ownership_name", );
		frm.set_value("client_management_name", );
		frm.set_value("client_technical_name", );
		frm.set_value("tawari_steering_name", );
		frm.set_value("tawari_ownership_name", );
		frm.set_value("tawari_management_name", );
		frm.set_value("tawari_technical_name", );
		frm.set_value("partner_steering_name", );
		frm.set_value("partner_ownership_name", );
		frm.set_value("partner_management_name", );
		frm.set_value("partner_technical_name", );
		
		for(var i =0;i<cur_frm.doc.roles_and_responsibilities.length;i++){
			if(cur_frm.doc.roles_and_responsibilities[i].party == 'Client'){
	            if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Steering Committee'){
	                frm.set_value("client_steering_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Ownership level'){
	                frm.set_value("client_ownership_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Project Management'){
	                frm.set_value("client_management_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Technical management'){
	                frm.set_value("client_technical_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }
	        }
	        if(cur_frm.doc.roles_and_responsibilities[i].party == 'Tawari'){
	            if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Steering Committee'){
	                frm.set_value("tawari_steering_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Ownership level'){
	                frm.set_value("tawari_ownership_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Project Management'){
	                frm.set_value("tawari_management_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Technical management'){
	                frm.set_value("tawari_technical_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }
	        }
	        if(cur_frm.doc.roles_and_responsibilities[i].party == 'Partner/Supplier'){
	            if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Steering Committee'){
	                frm.set_value("partner_steering_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Ownership level'){
	                frm.set_value("partner_ownership_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Project Management'){
	                frm.set_value("partner_management_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Technical management'){
	                frm.set_value("partner_technical_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }
	        }
	    }

	},
	project_role: function(frm, doctype, name) {
		
		frm.set_value("client_steering_name", );
		frm.set_value("client_ownership_name", );
		frm.set_value("client_management_name", );
		frm.set_value("client_technical_name", );
		frm.set_value("tawari_steering_name", );
		frm.set_value("tawari_ownership_name", );
		frm.set_value("tawari_management_name", );
		frm.set_value("tawari_technical_name", );
		frm.set_value("partner_steering_name", );
		frm.set_value("partner_ownership_name", );
		frm.set_value("partner_management_name", );
		frm.set_value("partner_technical_name", );
		
		for(var i =0;i<cur_frm.doc.roles_and_responsibilities.length;i++){
			if(cur_frm.doc.roles_and_responsibilities[i].party == 'Client'){
	            if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Steering Committee'){
	                frm.set_value("client_steering_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Ownership level'){
	                frm.set_value("client_ownership_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Project Management'){
	                frm.set_value("client_management_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Technical management'){
	                frm.set_value("client_technical_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }
	        }
	        if(cur_frm.doc.roles_and_responsibilities[i].party == 'Tawari'){
	            if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Steering Committee'){
	                frm.set_value("tawari_steering_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Ownership level'){
	                frm.set_value("tawari_ownership_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Project Management'){
	                frm.set_value("tawari_management_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Technical management'){
	                frm.set_value("tawari_technical_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }
	        }
	        if(cur_frm.doc.roles_and_responsibilities[i].party == 'Partner/Supplier'){
	            if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Steering Committee'){
	                frm.set_value("partner_steering_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Ownership level'){
	                frm.set_value("partner_ownership_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Project Management'){
	                frm.set_value("partner_management_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Technical management'){
	                frm.set_value("partner_technical_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }
	        }
	    }

	},
	name1: function(frm, doctype, name) {

		frm.set_value("client_steering_name", );
		frm.set_value("client_ownership_name", );
		frm.set_value("client_management_name", );
		frm.set_value("client_technical_name", );
		frm.set_value("tawari_steering_name", );
		frm.set_value("tawari_ownership_name", );
		frm.set_value("tawari_management_name", );
		frm.set_value("tawari_technical_name", );
		frm.set_value("partner_steering_name", );
		frm.set_value("partner_ownership_name", );
		frm.set_value("partner_management_name", );
		frm.set_value("partner_technical_name", );
		
		for(var i =0;i<cur_frm.doc.roles_and_responsibilities.length;i++){
			if(cur_frm.doc.roles_and_responsibilities[i].party == 'Client'){
	            if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Steering Committee'){
	                frm.set_value("client_steering_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Ownership level'){
	                frm.set_value("client_ownership_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Project Management'){
	                frm.set_value("client_management_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Technical management'){
	                frm.set_value("client_technical_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }
	        }
	        if(cur_frm.doc.roles_and_responsibilities[i].party == 'Tawari'){
	            if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Steering Committee'){
	                frm.set_value("tawari_steering_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Ownership level'){
	                frm.set_value("tawari_ownership_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Project Management'){
	                frm.set_value("tawari_management_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Technical management'){
	                frm.set_value("tawari_technical_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }
	        }
	        if(cur_frm.doc.roles_and_responsibilities[i].party == 'Partner/Supplier'){
	            if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Steering Committee'){
	                frm.set_value("partner_steering_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Ownership level'){
	                frm.set_value("partner_ownership_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Project Management'){
	                frm.set_value("partner_management_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }if(cur_frm.doc.roles_and_responsibilities[i].project_role == 'Technical management'){
	                frm.set_value("partner_technical_name", cur_frm.doc.roles_and_responsibilities[i].name1);
	            }
	        }
	    }

	},
	other_name: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if(row.other_name && row.party!='Tawari'){
			frappe.model.set_value(cdt, cdn, 'name1', row.other_name);
		}
	}
	

});
