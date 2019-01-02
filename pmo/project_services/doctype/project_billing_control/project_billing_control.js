// Copyright (c) 2018, s and contributors
// For license information, please see license.txt
cur_frm.add_fetch('Project Initiation','sales_order','sales_order');

var calculate_total_and_save = true;
frappe.ui.form.on('Project Billing Control', {
    validate: function(frm){
        cur_frm.doc.project_payment_schedule_bundle_qty = []
        $.each(frm.doc.project_payment_schedule_control || [], function(i, v) {
            if(v.invoice==1){
                // cur_frm.doc.project_payment_schedule_bundle_qty = []
                frappe.model.with_doc("Project Initiation", frm.doc.project_name, function() {
                    var tabletransfer= frappe.model.get_doc("Project Initiation", frm.doc.project_name)
                    // frm.doc.project_payment_schedule_bundle_qty = []
                    // frm.refresh_field("project_payment_schedule_bundle_qty");
                    $.each(tabletransfer.project_payment_schedule_bundle_qty, function(index, row){
                        if(v.old_name==row.parent_name){
                            d = frm.add_child("project_payment_schedule_bundle_qty");
                            d.scope_item = row.scope_item;
                            d.qty = row.qty;
                            d.item = row.item;
                            d.item_name = row.item_name;
                            d.parent_qty = row.parent_qty;
                            d.parent_name = row.parent_name;
                            // frm.refresh_field("project_payment_schedule_bundle_qty");
                        }
                    });
                })
            }
        

        });
            

    frm.refresh_field("project_payment_schedule_bundle_qty");


    },
    after_save: function(frm) {

        frappe.call({
            "method": "get_total_billing_so_far",
            doc: cur_frm.doc,
            callback: function (r) {
                if(r){
                    cur_frm.set_value("total_project_billing_so_far", r.message[0])
                    cur_frm.set_value("total_scope_item_billing_so_far", r.message[1])
                    if(calculate_total_and_save){
                        frm.save()
                        calculate_total_and_save = false;
                    }
                }
            }
        });

    },
    refresh: function(frm,cdt,cdn) {
        var df = frappe.meta.get_docfield("Project Payment Schedule Bundle QTY","qty", cur_frm.doc.name);
        df.read_only = 1;

        var df = frappe.meta.get_docfield("Project Payment Schedule","is_advance", cur_frm.doc.name);
        df.read_only = 1;


        frm.add_custom_button(__("Make Sales Order Approval"), function () {
            
            frappe.call({
                "method": "make_project_sales_order_approval",
                doc: cur_frm.doc,
                callback: function (r) {

                }
            });

        });



        // frm.add_custom_button(__("Make Delivery Note"), function () {
        //  // items = []
        //  for(var row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
        //      if(cur_frm.doc.project_payment_schedule_control[row].invoice == 1){
        //          var scope_item = cur_frm.doc.project_payment_schedule_control[row].scope_item
        //          if(scope_item){
        //              scope_item=scope_item
        //          }else{
        //              scope_item=''
        //          }

        //          var project_name = cur_frm.doc.project_name
        //          if(project_name){
        //              project_name=project_name
        //          }else{
        //              project_name=''
        //          }

        //          var items_value = cur_frm.doc.project_payment_schedule_control[row].items_value
        //          if(items_value){
        //              items_value=items_value
        //          }else{
        //              items_value=0
        //          }

        //          var billing_percentage = cur_frm.doc.project_payment_schedule_control[row].billing_percentage
        //          if(billing_percentage){
        //              billing_percentage=billing_percentage
        //          }else{
        //              billing_percentage=0
        //          }


        //          if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Date'){
        //              var due_date = cur_frm.doc.project_payment_schedule_control[row].when
        //              if(due_date){
        //                  due_date=due_date
        //              }else{
        //                  due_date=''
        //              }
        //          }else if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Period'){
        //              var due_date = cur_frm.doc.project_payment_schedule_control[row].to_date
        //              if(due_date){
        //                  due_date=due_date
        //              }else{
        //                  due_date=''
        //              }
        //          }

        //          var description_when = cur_frm.doc.project_payment_schedule_control[row].description_when
        //          if(description_when){
        //              description_when=description_when
        //          }else{
        //              description_when=''
        //          }

        //          var vat_value = cur_frm.doc.project_payment_schedule_control[row].vat_value
        //          if(vat_value){
        //              vat_value=vat_value
        //          }else{
        //              vat_value=0
        //          }

        //          var billing_status = cur_frm.doc.project_payment_schedule_control[row].billing_status
        //          if(billing_status){
        //              billing_status=billing_status
        //          }else{
        //              billing_status=0
        //          }

        //          var delivery_note = cur_frm.doc.project_payment_schedule_control[row].delivery_note
        //          if(delivery_note){
        //              delivery_note=delivery_note
        //          }else{
        //              delivery_note=''
        //          }

        //          var total_billing_value = cur_frm.doc.project_payment_schedule_control[row].total_billing_value
        //          if(total_billing_value){
        //              total_billing_value=total_billing_value
        //          }else{
        //              total_billing_value=0
        //          }

        //          var remaining_billing_value = cur_frm.doc.project_payment_schedule_control[row].remaining_billing_value
        //          if(remaining_billing_value){
        //              remaining_billing_value=remaining_billing_value
        //          }else{
        //              remaining_billing_value=0
        //          }

        //          var schedule_bundle_qty_name = cur_frm.doc.project_payment_schedule_control[row].old_name
        //          if(schedule_bundle_qty_name){
        //              schedule_bundle_qty_name=schedule_bundle_qty_name
        //          }else{
        //              schedule_bundle_qty_name=1
        //          }

        //          var is_advance = cur_frm.doc.project_payment_schedule_control[row].is_advance
        //          if(is_advance){
        //              is_advance=is_advance
        //          }else{
        //              is_advance=0
        //          }


        //          frappe.call({
        //              "method": "make_delivery_note",
        //              doc: cur_frm.doc,
        //              args: { "scope_item": scope_item,"project_name": project_name,
        //                      "items_value": items_value,"billing_percentage": billing_percentage,
        //                      "due_date": due_date,"description_when":description_when,"vat_value":vat_value,
        //                      "billing_state":billing_status,"delivery_note":delivery_note,"schedule_bundle_qty_name":schedule_bundle_qty_name,
        //                      "is_advance" : is_advance
        //                  },
        //              callback: function (r) {
        //                     delivery_note_name = r.message
        //                     $.each(frm.doc.project_payment_schedule_control || [], function(i, v) {
        //                      if(v.invoice && delivery_note_name){

        //                          frappe.model.set_value(v.doctype, v.name, "delivery_note", delivery_note_name)
     //                                 frappe.model.set_value(v.doctype, v.name, "billing_status", 1)
     //                                 cur_frm.save()
                                    
        //                          frappe.call({
        //                              "method": "updat_init_payment_table_delivery_note",
        //                              doc: cur_frm.doc,
        //                              args: {"delivery_note":delivery_note_name,"scope_item": scope_item,
        //                                     "billing_percentage": billing_percentage,"total_billing_value": total_billing_value,
        //                                     "remaining_billing_value": remaining_billing_value},
        //                              callback: function (r) {
        //                                  if(r.message){

        //                                  }
        //                              }
        //                          });
        //                      }

        //                       })
        //              }

        //          });

        //      }
        //  }
  //    });
        

    


        frm.add_custom_button(__("Make Delivery Note"), function () {

            var items=[]

            for(var row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
                if(cur_frm.doc.project_payment_schedule_control[row].invoice == 1){
                    var arr1= []
                    items.push(arr1)

                    var scope_item = cur_frm.doc.project_payment_schedule_control[row].scope_item
                    if(scope_item){
                        scope_item=scope_item
                    }else{
                        scope_item=''
                    }
                    arr1.push(scope_item)


                    var project_name = cur_frm.doc.project_name
                    if(project_name){
                        project_name=project_name
                    }else{
                        project_name=''
                    }
                    arr1.push(project_name)


                    var items_value = cur_frm.doc.project_payment_schedule_control[row].items_value
                    if(items_value){
                        items_value=items_value
                    }else{
                        items_value=0
                    }
                    arr1.push(items_value)


                    var billing_percentage = cur_frm.doc.project_payment_schedule_control[row].billing_percentage
                    if(billing_percentage){
                        billing_percentage=billing_percentage
                    }else{
                        billing_percentage=0
                    }
                    arr1.push(billing_percentage)


                    if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Date'){
                        var due_date = cur_frm.doc.project_payment_schedule_control[row].when
                        if(due_date){
                            due_date=due_date
                        }else{
                            due_date=''
                        }
                    }else if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Period'){
                        var due_date = cur_frm.doc.project_payment_schedule_control[row].to_date
                        if(due_date){
                            due_date=due_date
                        }else{
                            due_date=''
                        }
                    }
                    arr1.push(due_date)

                    var description_when = cur_frm.doc.project_payment_schedule_control[row].description_when
                    if(description_when){
                        description_when=description_when
                    }else{
                        description_when=''
                    }
                    arr1.push(description_when)


                    var vat_value = cur_frm.doc.project_payment_schedule_control[row].vat_value
                    if(vat_value){
                        vat_value=vat_value
                    }else{
                        vat_value=0
                    }
                    arr1.push(vat_value)

                    var billing_status = cur_frm.doc.project_payment_schedule_control[row].billing_status
                    if(billing_status){
                        billing_status=billing_status
                    }else{
                        billing_status=0
                    }
                    arr1.push(billing_status)

                    var delivery_note = cur_frm.doc.project_payment_schedule_control[row].delivery_note
                    if(delivery_note){
                        delivery_note=delivery_note
                    }else{
                        delivery_note=''
                    }
                    arr1.push(delivery_note)


                    var schedule_bundle_qty_name = cur_frm.doc.project_payment_schedule_control[row].old_name
                    if(schedule_bundle_qty_name){
                        schedule_bundle_qty_name=schedule_bundle_qty_name
                    }else{
                        schedule_bundle_qty_name=1
                    }
                    arr1.push(schedule_bundle_qty_name)

                    var is_advance = cur_frm.doc.project_payment_schedule_control[row].is_advance
                    if(is_advance){
                        is_advance=is_advance
                    }else{
                        is_advance=0
                    }
                    arr1.push(is_advance)


                    var total_billing_value = cur_frm.doc.project_payment_schedule_control[row].total_billing_value
                    if(total_billing_value){
                        total_billing_value=total_billing_value
                    }else{
                        total_billing_value=0
                    }
                    arr1.push(total_billing_value)


                    var remaining_billing_value = cur_frm.doc.project_payment_schedule_control[row].remaining_billing_value
                    if(remaining_billing_value){
                        remaining_billing_value=remaining_billing_value
                    }else{
                        remaining_billing_value=0
                    }
                    arr1.push(remaining_billing_value)



                    var project_schedule_name = cur_frm.doc.project_payment_schedule_control[row].name
                    if(project_schedule_name){
                        project_schedule_name=project_schedule_name
                    }else{
                        remaining_billing_value=''
                    }
                    arr1.push(project_schedule_name)



                    var old_name = cur_frm.doc.project_payment_schedule_control[row].old_name
                    if(old_name){
                        old_name=old_name
                    }else{
                        old_name=''
                    }
                    arr1.push(old_name)


                }
            }


                    frappe.call({
                        "method": "make_delivery_note",
                        doc: cur_frm.doc,
                        args: { "scope_item": scope_item,"project_name": project_name,
                                "items_value": items_value,"billing_percentage": billing_percentage,
                                "due_date": due_date,"description_when":description_when,"vat_value":vat_value,
                                "billing_state":billing_status,"delivery_note":delivery_note,"schedule_bundle_qty_name":schedule_bundle_qty_name,
                                "is_advance" : is_advance,"items":items
                            },
                        callback: function (r) {
                            delivery_note_name = r.message
                            $.each(frm.doc.project_payment_schedule_control || [], function(i, v) {
                                if(v.invoice && delivery_note_name){

                                    frappe.model.set_value(v.doctype, v.name, "delivery_note", delivery_note_name)
                                    frappe.model.set_value(v.doctype, v.name, "billing_status", 1)
                                    
                                }
                                cur_frm.save()
                             })

                            frappe.call({
                                "method": "updat_init_payment_table_delivery_note",
                                doc: cur_frm.doc,
                                args: {"delivery_note":delivery_note_name,"scope_item": scope_item,
                                       "billing_percentage": billing_percentage,"total_billing_value": total_billing_value,
                                       "remaining_billing_value": remaining_billing_value,"items":items},
                                callback: function (r) {
                                    if(r.message){

                                    }
                                }
                            });
                        

                        }

                    });

        });







        frm.add_custom_button(__("Make Sales Invoice"), function () {
                
            var items=[]

            for(var row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
                if(cur_frm.doc.project_payment_schedule_control[row].invoice == 1){
                    var arr1= []
                    items.push(arr1)


                    var scope_item = cur_frm.doc.project_payment_schedule_control[row].scope_item
                    if(scope_item){
                        scope_item=scope_item
                    }else{
                        scope_item=''
                    }
                    arr1.push(scope_item)


                    var project_name = cur_frm.doc.project_name
                    if(project_name){
                        project_name=project_name
                    }else{
                        project_name=''
                    }
                    arr1.push(project_name)


                    var items_value = cur_frm.doc.project_payment_schedule_control[row].items_value
                    if(items_value){
                        items_value=items_value
                    }else{
                        items_value=0
                    }
                    arr1.push(items_value)


                    var billing_percentage = cur_frm.doc.project_payment_schedule_control[row].billing_percentage
                    if(billing_percentage){
                        billing_percentage=billing_percentage
                    }else{
                        billing_percentage=0
                    }
                    arr1.push(billing_percentage)


                    if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Date'){
                        var due_date = cur_frm.doc.project_payment_schedule_control[row].when
                        if(due_date){
                            due_date=due_date
                        }else{
                            due_date=''
                        }
                    }else if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Period'){
                        var due_date = cur_frm.doc.project_payment_schedule_control[row].to_date
                        if(due_date){
                            due_date=due_date
                        }else{
                            due_date=''
                        }
                    }
                    arr1.push(due_date)


                    var description_when = cur_frm.doc.project_payment_schedule_control[row].description_when
                    if(description_when){
                        description_when=description_when
                    }else{
                        description_when=''
                    }
                    arr1.push(description_when)


                    var vat_value = cur_frm.doc.project_payment_schedule_control[row].vat_value
                    if(vat_value){
                        vat_value=vat_value
                    }else{
                        vat_value=0
                    }
                    arr1.push(vat_value)


                    var billing_status = cur_frm.doc.project_payment_schedule_control[row].billing_status
                    if(billing_status){
                        billing_status=billing_status
                    }else{
                        billing_status=0
                    }
                    arr1.push(billing_status)


                    var delivery_note = cur_frm.doc.project_payment_schedule_control[row].delivery_note
                    if(delivery_note){
                        delivery_note=delivery_note
                    }else{
                        delivery_note=''
                    }
                    arr1.push(delivery_note)


                    var schedule_bundle_qty_name = cur_frm.doc.project_payment_schedule_control[row].old_name
                    if(schedule_bundle_qty_name){
                        schedule_bundle_qty_name=schedule_bundle_qty_name
                    }else{
                        schedule_bundle_qty_name=''
                    }
                    arr1.push(schedule_bundle_qty_name)


                    var is_advance = cur_frm.doc.project_payment_schedule_control[row].is_advance
                    if(is_advance){
                        is_advance=is_advance
                    }else{
                        is_advance=0
                    }
                    arr1.push(is_advance)


                    var sales_invoice = cur_frm.doc.project_payment_schedule_control[row].sales_invoice
                    if(sales_invoice){
                        sales_invoice=sales_invoice
                    }else{
                        sales_invoice=''
                    }
                    arr1.push(sales_invoice)


                    var advanced_item = cur_frm.doc.project_payment_schedule_control[row].advanced_item
                    if(advanced_item){
                        advanced_item=advanced_item
                    }else{
                        advanced_item=''
                    }
                    arr1.push(advanced_item)


                    var billing_value = cur_frm.doc.project_payment_schedule_control[row].billing_value
                    if(billing_value){
                        billing_value=billing_value
                    }else{
                        billing_value=0
                    }
                    arr1.push(billing_value)


                    var total_billing_value = cur_frm.doc.project_payment_schedule_control[row].total_billing_value
                    if(total_billing_value){
                        total_billing_value=total_billing_value
                    }else{
                        total_billing_value=0
                    }
                    arr1.push(total_billing_value)


                    var remaining_billing_value = cur_frm.doc.project_payment_schedule_control[row].remaining_billing_value
                    if(remaining_billing_value){
                        remaining_billing_value=remaining_billing_value
                    }else{
                        remaining_billing_value=0
                    }
                    arr1.push(remaining_billing_value)


                    var project_schedule_name = cur_frm.doc.project_payment_schedule_control[row].name
                    if(project_schedule_name){
                        project_schedule_name=project_schedule_name
                    }else{
                        remaining_billing_value=''
                    }
                    arr1.push(project_schedule_name)


                    var advance_project_items = cur_frm.doc.project_payment_schedule_control[row].advance_project_items
                    if(advance_project_items){
                        advance_project_items=advance_project_items
                    }else{
                        advance_project_items=''
                    }
                    arr1.push(advance_project_items)


                    var remaining_billing_percent = cur_frm.doc.project_payment_schedule_control[row].remaining_billing_percent
                    if(remaining_billing_percent){
                        remaining_billing_percent=remaining_billing_percent
                    }else{
                        advance_project_items=0
                    }
                    arr1.push(remaining_billing_percent)


                    var old_name = cur_frm.doc.project_payment_schedule_control[row].old_name
                    if(old_name){
                        old_name=old_name
                    }else{
                        old_name=''
                    }
                    arr1.push(old_name)

                }
            }


                    frappe.call({
                        "method": "make_sales_invoice",
                        doc: cur_frm.doc,
                        args: { "scope_item": scope_item,"project_name": project_name,
                                "items_value": items_value,"billing_percentage": billing_percentage,
                                "due_date": due_date,"description_when":description_when,"vat_value":vat_value,
                                "billing_state":billing_status,"delivery_note":delivery_note,"schedule_bundle_qty_name":schedule_bundle_qty_name,
                                "is_advance":is_advance,"sales_invoice":sales_invoice,"advanced_item":advanced_item,"billing_value":billing_value,"items":items
                            },
                        callback: function (r) {
                            sales_invoice_name = r.message
                            $.each(frm.doc.project_payment_schedule_control || [], function(i, v) {
                                if(v.invoice && sales_invoice_name){

                                    frappe.model.set_value(v.doctype, v.name, "sales_invoice", sales_invoice_name)
                                    frappe.model.set_value(v.doctype, v.name, "billing_status", 1)
                                }
                                cur_frm.save()
                            })
                            
                                    
                            frappe.call({
                                "method": "updat_init_payment_table_sales_invoice",
                                doc: cur_frm.doc,
                                args: {"sales_invoice":sales_invoice_name,"scope_item": scope_item,
                                       "billing_percentage": billing_percentage,"total_billing_value": total_billing_value,
                                       "remaining_billing_value": remaining_billing_value,"items":items},
                                callback: function (r) {
                                    if(r.message){

                                    }
                                }
                            });
                            
                        
                        }

                    });

              

        });




		frm.add_custom_button(__("Make hybrid Invoice"), function () {
                
            var items=[]

            for(var row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
                if(cur_frm.doc.project_payment_schedule_control[row].invoice == 1){
                    var arr1= []
                    items.push(arr1)


                    var scope_item = cur_frm.doc.project_payment_schedule_control[row].scope_item
                    if(scope_item){
                        scope_item=scope_item
                    }else{
                        scope_item=''
                    }
                    arr1.push(scope_item)


                    var project_name = cur_frm.doc.project_name
                    if(project_name){
                        project_name=project_name
                    }else{
                        project_name=''
                    }
                    arr1.push(project_name)


                    var items_value = cur_frm.doc.project_payment_schedule_control[row].items_value
                    if(items_value){
                        items_value=items_value
                    }else{
                        items_value=0
                    }
                    arr1.push(items_value)


                    var billing_percentage = cur_frm.doc.project_payment_schedule_control[row].billing_percentage
                    if(billing_percentage){
                        billing_percentage=billing_percentage
                    }else{
                        billing_percentage=0
                    }
                    arr1.push(billing_percentage)


                    if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Date'){
                        var due_date = cur_frm.doc.project_payment_schedule_control[row].when
                        if(due_date){
                            due_date=due_date
                        }else{
                            due_date=''
                        }
                    }else if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Period'){
                        var due_date = cur_frm.doc.project_payment_schedule_control[row].to_date
                        if(due_date){
                            due_date=due_date
                        }else{
                            due_date=''
                        }
                    }
                    arr1.push(due_date)


                    var description_when = cur_frm.doc.project_payment_schedule_control[row].description_when
                    if(description_when){
                        description_when=description_when
                    }else{
                        description_when=''
                    }
                    arr1.push(description_when)


                    var vat_value = cur_frm.doc.project_payment_schedule_control[row].vat_value
                    if(vat_value){
                        vat_value=vat_value
                    }else{
                        vat_value=0
                    }
                    arr1.push(vat_value)


                    var billing_status = cur_frm.doc.project_payment_schedule_control[row].billing_status
                    if(billing_status){
                        billing_status=billing_status
                    }else{
                        billing_status=0
                    }
                    arr1.push(billing_status)


                    var delivery_note = cur_frm.doc.project_payment_schedule_control[row].delivery_note
                    if(delivery_note){
                        delivery_note=delivery_note
                    }else{
                        delivery_note=''
                    }
                    arr1.push(delivery_note)


                    var schedule_bundle_qty_name = cur_frm.doc.project_payment_schedule_control[row].old_name
                    if(schedule_bundle_qty_name){
                        schedule_bundle_qty_name=schedule_bundle_qty_name
                    }else{
                        schedule_bundle_qty_name=''
                    }
                    arr1.push(schedule_bundle_qty_name)


                    var is_advance = cur_frm.doc.project_payment_schedule_control[row].is_advance
                    if(is_advance){
                        is_advance=is_advance
                    }else{
                        is_advance=0
                    }
                    arr1.push(is_advance)


                    var sales_invoice = cur_frm.doc.project_payment_schedule_control[row].sales_invoice
                    if(sales_invoice){
                        sales_invoice=sales_invoice
                    }else{
                        sales_invoice=''
                    }
                    arr1.push(sales_invoice)


                    var advanced_item = cur_frm.doc.project_payment_schedule_control[row].advanced_item
                    if(advanced_item){
                        advanced_item=advanced_item
                    }else{
                        advanced_item=''
                    }
                    arr1.push(advanced_item)


                    var billing_value = cur_frm.doc.project_payment_schedule_control[row].billing_value
                    if(billing_value){
                        billing_value=billing_value
                    }else{
                        billing_value=0
                    }
                    arr1.push(billing_value)


                    var total_billing_value = cur_frm.doc.project_payment_schedule_control[row].total_billing_value
                    if(total_billing_value){
                        total_billing_value=total_billing_value
                    }else{
                        total_billing_value=0
                    }
                    arr1.push(total_billing_value)


                    var remaining_billing_value = cur_frm.doc.project_payment_schedule_control[row].remaining_billing_value
                    if(remaining_billing_value){
                        remaining_billing_value=remaining_billing_value
                    }else{
                        remaining_billing_value=0
                    }
                    arr1.push(remaining_billing_value)


                    var project_schedule_name = cur_frm.doc.project_payment_schedule_control[row].name
                    if(project_schedule_name){
                        project_schedule_name=project_schedule_name
                    }else{
                        remaining_billing_value=''
                    }
                    arr1.push(project_schedule_name)


                    var advance_project_items = cur_frm.doc.project_payment_schedule_control[row].advance_project_items
                    if(advance_project_items){
                        advance_project_items=advance_project_items
                    }else{
                        advance_project_items=''
                    }
                    arr1.push(advance_project_items)


                    var remaining_billing_percent = cur_frm.doc.project_payment_schedule_control[row].remaining_billing_percent
                    if(remaining_billing_percent){
                        remaining_billing_percent=remaining_billing_percent
                    }else{
                        advance_project_items=0
                    }
                    arr1.push(remaining_billing_percent)


                    var old_name = cur_frm.doc.project_payment_schedule_control[row].old_name
                    if(old_name){
                        old_name=old_name
                    }else{
                        old_name=''
                    }
                    arr1.push(old_name)
                    

                }
            }


                    frappe.call({
                        "method": "make_hybrid_invoice",
                        doc: cur_frm.doc,
                        args: { "scope_item": scope_item,"project_name": project_name,
                                "items_value": items_value,"billing_percentage": billing_percentage,
                                "due_date": due_date,"description_when":description_when,"vat_value":vat_value,
                                "billing_state":billing_status,"delivery_note":delivery_note,"schedule_bundle_qty_name":schedule_bundle_qty_name,
                                "is_advance":is_advance,"sales_invoice":sales_invoice,"advanced_item":advanced_item,"billing_value":billing_value,"items":items
                            },
                        callback: function (r) {
                            sales_invoice_name = r.message
                            $.each(frm.doc.project_payment_schedule_control || [], function(i, v) {
                                if(v.invoice && sales_invoice_name){

                                    frappe.model.set_value(v.doctype, v.name, "sales_invoice", sales_invoice_name)
                                    frappe.model.set_value(v.doctype, v.name, "billing_status", 1)
                                }
                                cur_frm.save()
                            })
                            
                                    
                            frappe.call({
                                "method": "updat_init_payment_table_hybrid_invoice",
                                doc: cur_frm.doc,
                                args: {"sales_invoice":sales_invoice_name,"scope_item": scope_item,
                                       "billing_percentage": billing_percentage,"total_billing_value": total_billing_value,
                                       "remaining_billing_value": remaining_billing_value,"items":items},
                                callback: function (r) {
                                    if(r.message){

                                    }
                                }
                            });
                            
                        
                        }

                    });

              

        });


        // frm.add_custom_button(__("Make Sales Invoice"), function () {
        //  // items = []
        //  for(var row= 0;row<cur_frm.doc.project_payment_schedule_control.length;row++){
        //      if(cur_frm.doc.project_payment_schedule_control[row].invoice == 1){
        //          var scope_item = cur_frm.doc.project_payment_schedule_control[row].scope_item
        //          if(scope_item){
        //              scope_item=scope_item
        //          }else{
        //              scope_item=''
        //          }

        //          var project_name = cur_frm.doc.project_name
        //          if(project_name){
        //              project_name=project_name
        //          }else{
        //              project_name=''
        //          }

        //          var items_value = cur_frm.doc.project_payment_schedule_control[row].items_value
        //          if(items_value){
        //              items_value=items_value
        //          }else{
        //              items_value=0
        //          }

        //          var billing_percentage = cur_frm.doc.project_payment_schedule_control[row].billing_percentage
        //          if(billing_percentage){
        //              billing_percentage=billing_percentage
        //          }else{
        //              billing_percentage=0
        //          }


        //          if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Date'){
        //              var due_date = cur_frm.doc.project_payment_schedule_control[row].when
        //              if(due_date){
        //                  due_date=due_date
        //              }else{
        //                  due_date=''
        //              }
        //          }else if(cur_frm.doc.project_payment_schedule_control[row].date_period=='Period'){
        //              var due_date = cur_frm.doc.project_payment_schedule_control[row].to_date
        //              if(due_date){
        //                  due_date=due_date
        //              }else{
        //                  due_date=''
        //              }
        //          }

        //          var description_when = cur_frm.doc.project_payment_schedule_control[row].description_when
        //          if(description_when){
        //              description_when=description_when
        //          }else{
        //              description_when=''
        //          }

        //          var vat_value = cur_frm.doc.project_payment_schedule_control[row].vat_value
        //          if(vat_value){
        //              vat_value=vat_value
        //          }else{
        //              vat_value=0
        //          }

        //          var billing_status = cur_frm.doc.project_payment_schedule_control[row].billing_status
        //          if(billing_status){
        //              billing_status=billing_status
        //          }else{
        //              billing_status=0
        //          }

        //          var delivery_note = cur_frm.doc.project_payment_schedule_control[row].delivery_note
        //          if(delivery_note){
        //              delivery_note=delivery_note
        //          }else{
        //              delivery_note=''
        //          }

        //          var total_billing_value = cur_frm.doc.project_payment_schedule_control[row].total_billing_value
        //          if(total_billing_value){
        //              total_billing_value=total_billing_value
        //          }else{
        //              total_billing_value=0
        //          }

        //          var remaining_billing_value = cur_frm.doc.project_payment_schedule_control[row].remaining_billing_value
        //          if(remaining_billing_value){
        //              remaining_billing_value=remaining_billing_value
        //          }else{
        //              remaining_billing_value=0
        //          }

        //          var schedule_bundle_qty_name = cur_frm.doc.project_payment_schedule_control[row].old_name
        //          if(schedule_bundle_qty_name){
        //              schedule_bundle_qty_name=schedule_bundle_qty_name
        //          }else{
        //              schedule_bundle_qty_name=1
        //          }

        //          var is_advance = cur_frm.doc.project_payment_schedule_control[row].is_advance
        //          if(is_advance){
        //              is_advance=is_advance
        //          }else{
        //              is_advance=0
        //          }


        //          var sales_invoice = cur_frm.doc.project_payment_schedule_control[row].sales_invoice
        //          if(sales_invoice){
        //              sales_invoice=sales_invoice
        //          }else{
        //              sales_invoice=''
        //          }


        //          var advanced_item = cur_frm.doc.project_payment_schedule_control[row].advanced_item
        //          if(advanced_item){
        //              advanced_item=advanced_item
        //          }else{
        //              advanced_item=''
        //          }


        //          var billing_value = cur_frm.doc.project_payment_schedule_control[row].billing_value
        //          if(billing_value){
        //              billing_value=billing_value
        //          }else{
        //              billing_value=0
        //          }


        //          frappe.call({
        //              "method": "make_sales_invoice",
        //              doc: cur_frm.doc,
        //              args: { "scope_item": scope_item,"project_name": project_name,
        //                      "items_value": items_value,"billing_percentage": billing_percentage,
        //                      "due_date": due_date,"description_when":description_when,"vat_value":vat_value,
        //                      "billing_state":billing_status,"delivery_note":delivery_note,"schedule_bundle_qty_name":schedule_bundle_qty_name,
        //                      "is_advance":is_advance,"sales_invoice":sales_invoice,"advanced_item":advanced_item,"billing_value":billing_value
        //                  },
        //              callback: function (r) {
        //                     sales_invoice_name = r.message
        //                     $.each(frm.doc.project_payment_schedule_control || [], function(i, v) {
        //                      if(v.invoice && sales_invoice_name){

        //                          frappe.model.set_value(v.doctype, v.name, "sales_invoice", sales_invoice_name)
     //                                 frappe.model.set_value(v.doctype, v.name, "billing_status", 1)
     //                                 cur_frm.save()
                                    
        //                          frappe.call({
        //                              "method": "updat_init_payment_table_sales_invoice",
        //                              doc: cur_frm.doc,
        //                              args: {"sales_invoice":sales_invoice_name,"scope_item": scope_item,
        //                                     "billing_percentage": billing_percentage,"total_billing_value": total_billing_value,
        //                                     "remaining_billing_value": remaining_billing_value},
        //                              callback: function (r) {
        //                                  if(r.message){

        //                                  }
        //                              }
        //                          });
        //                      }

        //                       })
        //              }

        //          });

        //      }
        //  }
  //    });
        





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
                    d.qty = row.qty;
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
                    d.billing_status = row.billing_status;
                    d.is_advance = row.is_advance;
                    d.advanced_item = row.advanced_item;
                    d.advance_project_items = row.advance_project_items;
                    d.project_item_price = row.project_item_price;
                    d.advance_percent = row.advance_percent;
                    d.delivery_note = row.delivery_note;
                    d.sales_invoice = row.sales_invoice;
                    d.project_item_arabic = row.project_item_arabic;
                    d.old_name = row.name;
                    frm.refresh_field("project_payment_schedule_control");
                });
                cur_frm.set_value("sales_order", tabletransfer.sales_order)
            })





            // cur_frm.doc.project_payment_schedule_bundle_qty = []
            // frappe.model.with_doc("Project Initiation", frm.doc.project_name, function() {
            //     var tabletransfer= frappe.model.get_doc("Project Initiation", frm.doc.project_name)
            //     frm.doc.project_payment_schedule_bundle_qty = []
            //     frm.refresh_field("project_payment_schedule_bundle_qty");
            //     $.each(tabletransfer.project_payment_schedule_bundle_qty, function(index, row){
            //         d = frm.add_child("project_payment_schedule_bundle_qty");
            //         d.scope_item = row.scope_item;
            //         d.qty = row.qty;
            //         d.item = row.item;
            //         d.item_name = row.item_name;
            //         d.parent_qty = row.parent_qty;
            //         d.parent_name = row.parent_name;
            //         frm.refresh_field("project_payment_schedule_bundle_qty");
            //     });
            // })


        }
    }
});


