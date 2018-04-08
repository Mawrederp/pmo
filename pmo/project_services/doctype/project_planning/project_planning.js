// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Planning', {
	refresh: function(frm) {

	}
});


frappe.ui.form.on("Roles And Responsibilities", {
	party: function(frm, doctype, name) {

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

	}
	
});
