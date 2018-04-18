// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Quotation', {
	refresh: function(frm) {

	},
	total_profit:function(frm){
		if (cur_frm.doc.total_profit && cur_frm.doc.total_cost_price){
			var totals = 0;
			totals = flt(cur_frm.doc.total_profit) / flt(cur_frm.doc.total_cost_price)*100
			frm.set_value("total_markup",totals)
	    }
	    if (cur_frm.doc.total_profit && cur_frm.doc.total_selling_price){
			var totals_margin = 0;
			totals_margin = flt(cur_frm.doc.total_profit) / flt(cur_frm.doc.total_selling_price)*100
			frm.set_value("total_margin",totals_margin)
	    }
        
	},
	total_cost_price:function(frm){
		if (cur_frm.doc.total_profit && cur_frm.doc.total_cost_price){
			var totals = 0;
			totals = flt(cur_frm.doc.total_profit) / flt(cur_frm.doc.total_cost_price)*100
			console.log(totals);
			frm.set_value("total_markup",totals)
	    }
        
	},
	total_selling_price:function(frm){
		if (cur_frm.doc.total_profit && cur_frm.doc.total_selling_price){
			var totals_margin = 0;
			totals_margin = flt(cur_frm.doc.total_profit) / flt(cur_frm.doc.total_selling_price)*100
			frm.set_value("total_margin",totals_margin)
	    }

	}



});



cur_frm.set_query("items_develop", "development_services", function(doc, cdt, cdn) {
    var d = locals[cdt][cdn];
    return{
        filters: [
            ['Item', 'item_group', '=', d.group_code_develop]
        ]
    }
});



frappe.ui.form.on('Development Services', {
	currency_develop : function (frm, cdt, cdn){
		var row = locals[cdt][cdn];
		if ( row.currency_develop == 'SAR' && row.cost_price_develop){
			frappe.model.set_value(cdt, cdn, "sar_cost_price_develop",row.cost_price_develop);
		}
        else{
        	frappe.model.set_value(cdt, cdn, "sar_cost_price_develop",row.cost_price_develop *3.75);
        }
 
	},
	cost_price_develop: function (frm, cdt, cdn){
		var row = locals[cdt][cdn];
		if ( row.currency_develop == 'SAR' && row.cost_price_develop){
			frappe.model.set_value(cdt, cdn, "sar_cost_price_develop",row.cost_price_develop);
		}
        else{
        	frappe.model.set_value(cdt, cdn, "sar_cost_price_develop",row.cost_price_develop *3.75);
        }
        var total_price = 0;
        $.each(frm.doc.development_services || [], function(i, d) {
        	console.log('awef')
            total_price += flt(d.cost_price_develop);
        });
        frm.set_value("total_cost_price",total_price);

 
	},
	total_cost_price_develop: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.total_cost_price_develop && row.markup_develop){
			frappe.model.set_value(cdt, cdn, "selling_price_develop",row.total_cost_price_develop *(row.total_cost_price_develop * (row.markup_develop /100)));

		}   
		if(row.selling_price_develop && row.total_cost_price_develop){
			frappe.model.set_value(cdt, cdn, "profit_develop",row.selling_price_develop - row.total_cost_price_develop);

		}


    },
    markup_develop: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.total_cost_price_develop && row.markup_develop){
			frappe.model.set_value(cdt, cdn, "selling_price_develop",row.total_cost_price_develop *(row.total_cost_price_develop * (row.markup_develop /100)));

		}
		if(row.profit_develop && row.markup_develop){
			frappe.model.set_value(cdt, cdn, "margin_develop",(row.profit_develop / row.selling_price_develop) *100);

		}

    },
    quantity_develop: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.quantity_develop && row.sar_cost_price_develop){
			frappe.model.set_value(cdt, cdn, "total_cost_price_develop",row.quantity_develop * row.sar_cost_price_develop);

		}

    },
    sar_cost_price_develop: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.quantity_develop && row.sar_cost_price_develop){
			frappe.model.set_value(cdt, cdn, "total_cost_price_develop",row.quantity_develop * row.sar_cost_price_develop);

		}

    },
  
    profit_develop: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.profit_develop && row.markup_develop){
			frappe.model.set_value(cdt, cdn, "margin_develop",100 * (row.profit_develop / row.selling_price_develop));

		}
		var total_profit = 0;
        $.each(frm.doc.development_services || [], function(i, d) {
        	console.log('awef')
            total_profit += flt(d.profit_develop);
        });
        frm.set_value("total_profit",total_profit);

    },
    selling_price_develop: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.selling_price_develop && row.total_cost_price_develop){
			frappe.model.set_value(cdt, cdn, "profit_develop",row.selling_price_develop - row.total_cost_price_develop);

		}

    },
    selling_price_develop: function (frm, cdt, cdn) {
    	var total_selling = 0;
        $.each(frm.doc.development_services || [], function(i, d) {
        	console.log('awef')
            total_selling += flt(d.selling_price_develop);
        });
        frm.set_value("total_selling_price",total_selling);

    }


 

    

});


// frappe.ui.form.on("Development Services", "cost_price_develop", function(frm, cdt, cdn) {
//     // code for calculate total and set on parent field.
//        var total_price = 0;
//         $.each(frm.doc.development_services || [], function(i, d) {
//         	console.log('awef')
//             total_price += flt(d.cost_price_develop);
//         });
//         frm.set_value("total_cost_price",total_price);
// });

