// Copyright (c) 2018, s and contributors
// For license information, please see license.txt

frappe.ui.form.on('Project Gantt', {

	onload: function(frm){
		frm.add_custom_button(__("Save Data"), function() {
			if (frm.project_gantt){
				var gantt_tasks = [];
				frm.project_gantt.eachTask(function(task){
					gantt_tasks.push(task);
				});

				frappe.call({
		            method: 'pmo.project_services.doctype.project_gantt.project_gantt.save_tasks',
		            args: {
		                'tasks': gantt_tasks,
		                'project_name': frm.doc.project
		            },
		            freeze: true,
		            freeze_message: "Saving Data..",
		            // async: false,
		            callback: function(r) {
		            	if(!r.exc){
		            		// console.log(r.message);
		            		var links = frm.project_gantt.getLinks();

		            		if(links){
			            		frappe.call({
						            method: 'pmo.project_services.doctype.project_gantt.project_gantt.save_links',
						            args: {
						                'links': links,
						                'project_name': frm.doc.project
						            },
						            freeze: true,
						            freeze_message: "Saving Links..",
						            // async: false,
						            callback: function(r) {
						            	if(!r.exc){
						            		// console.log(r.message);
						            		// frappe.msgprint(__("Data & Links are Saved"));
						            	}
						            	
						            	// console.log(r.message);
						            	// console.log(gantt_tasks);
						            }
						        });
						    }
		            	}
		            	
		            	// console.log(r.message);
		            	// console.log(gantt_tasks);
		            }
		        });
			}
		});

	},

	refresh: function(frm) {
		frm.disable_save();
	},
	project: function(frm){
		var project_gantt = {};
		// var load_c = 0;

		var data = [];
		// var links = [];
		var selected_project = frm.doc.project;
		if(selected_project){
			frappe.model.with_doc("Project", selected_project, function(r) {
				var project_doc = frappe.model.get_doc("Project", selected_project);

				project_gantt = Gantt.getGanttInstance();

            	var start_date = moment(project_doc.start_date).format("DD-MM-YYYY");
            	var end_date = moment(project_doc.end_date).format("DD-MM-YYYY");
            	// var duration = moment(project_doc.end_date).diff(project_doc.start_date, "days");

				project_doc["id"] = project_doc.name;
				// project_doc["duration"] = duration;
				project_doc["start_date"] = start_date;
				project_doc["end_date"] = end_date;
				project_doc["text"] = project_doc.project_name;
				
				
				calculate_progress(project_gantt);
				project_doc["type"]=project_gantt.config.types.project;
				
				// project_gantt.config.lightbox_additional_height = 150;
				// project_gantt.config.scale_offset_minimal = false;
				// project_gantt.config.correct_work_time = true;
				project_gantt.config.xml_date = "%d-%m-%Y";
				// project_gantt.config.work_time = false;
				// project_gantt.config.date_grid = "%d-%m-%Y";
				// project_gantt.ignore_time = function(date){
				//    if(date.getDay() == 0 || date.getDay() == 6)
				//       return true;
				// };
				project_gantt.config.lightbox.project_sections = [
					{name:"description", height:70, map_to:"text", type:"textarea", focus:true},
			    	{name:"time", height:40, map_to:"auto", type:"time"}
		    	];

				data.push(project_doc);

				project_gantt.config.open_tree_initially = true;

				project_gantt.locale.labels.section_priority = "Priority";
				// project_gantt.locale.labels.section_party = "Party";
				project_gantt.locale.labels.section_type = "Type"

				var p_opts = [
				    { key: 'Low', label: 'Low' },
				    { key: 'Medium', label: 'Medium' },
				    { key: 'High', label: 'High' },
				    { key: 'Urgent', label: 'Urgent' }
				];
				var t_opts = [
					{ key: 'task', label: 'Task' },
				    { key: 'milestone', label: 'Milestone' },

				];
				// var party_opts = [
				// 	{ key: 'Client', label: 'Client' },
				//     { key: 'Tawari', label: 'Tawari' },
				//     { key: 'Partner/Supplier', label: 'Partner/Supplier' }
				// ];
				grid_table(project_gantt);

				project_gantt.config.lightbox.sections = [
					{name:"test", height:200, map_to:"resources", type:"my_editor"},
					{name:"description", height:70, map_to:"text", type:"textarea", focus:true},
			    	{name:"priority", height:30, map_to:"priority", type:"select", options:p_opts},
			    	{name:"type", height:30, type:"select", map_to:"type", options:t_opts, onchange: function(){
			    		// project_gantt.getLightboxSection("time").section.single_date = true;
			    		// project_gantt.getLightboxSection("time").section.single_date=true;
			    		// console.log(project_gantt.getLightboxSection("time").section);

			    		}
			    	},
			    	{name:"time", height:40, map_to:"auto", type:"time", single_date: false}
			    	// {name:"party", height:30, width:200, map_to:"party", type:"select", options:party_opts, button:"add"}
		    	];

		    	project_gantt.locale.labels.button_add="Add";
		   //  	project_gantt.config.lightbox.milestone_sections = [
					// {name:"description", height:70, map_to:"text", type:"textarea", focus:true},
			  //   	{name:"type", height:30, type:"select", map_to:"type", options:t_opts, single_date: true}
			  //   ];
				project_gantt.config.columns=[
					{name:"text",       label:"Task name",  tree:true, width:'*' },
					{name:"start_date", label:"Start time", align: "center" },
					{name:"end_date",   label:"End time",   align: "center" },
					{name:"add",        label:"" }
				];

				// project_gantt.templates.grid_header_class = function(columnName, column){
				//     if(columnName == "add"){
				//     	console.log(column)
				//     }
				// };

				project_gantt.config.grid_resize = true; 
				project_gantt.config.show_progress = true;
				project_gantt.init("gantt_here");
				project_gantt.parse({"data": data});

				frappe.call({
		            method: 'frappe.client.get_list',
		            args: {
		                'doctype': 'Task',
		                'filters': { 'project': selected_project },
		                'order_by': "creation",
		                'fields': '*'
		            },
		            freeze: true,
		            freeze_message: "Loading Gantt..",
		            callback: function(r) {
		            	
		                if (r.message) {							
							var tasks = r.message;
							// console.log(tasks);
							var links = [];
							for (var i in tasks){

								
								// var tsk = frappe.model.get_doc("Task", tasks[i].name);
								// console.log(tsk);
								
								// console.log(tasks[i].name);
								add_additional_data(project_gantt, tasks[i], selected_project);
								
								// rs = frappe.model.get_value('Task', {'name': tasks[i].name}, 'exp_end_date');
								// console.log("////////////",rs);
								
								// console.log(tasks[i]);
								// console.log(project_gantt.getTask(tasks[i].id));
							}

							frappe.call({
					            method: 'pmo.project_services.doctype.project_gantt.project_gantt.get_links',
					            args: {
					                'project_name': selected_project,
					            },
					            freeze: true,
					            freeze_message: "Loading Gantt..",
					            // async: false,
					            callback: function(r) {
					            	if(r.message){
					            		depends_on = r.message;
					            		
					            		for (var i in depends_on){

					            			project_gantt.addLink({
					            				"id": depends_on[i].id,
					            				"source": depends_on[i].task,
					            				"target": depends_on[i].parent,
					            				"type": depends_on[i].type,
					            				"name": depends_on[i].name
					            			});
					            			// links.push({
					            			// 	"id": depends_on[i].id,
					            			// 	"source": depends_on[i].task,
					            			// 	"target": depends_on[i].parent,
					            			// 	"type": depends_on[i].type
					            			// });
					            		}
					            		// console.log(links);

					            		// frappe.msgprint(__("Data & Links are Saved"));
					            	}
					            	
					            	// console.log(r.message);
					            	// console.log(gantt_tasks);
					            }
						    });

							project_gantt.parse({"data": tasks});
							project_gantt.refreshData();
							 
		               	
		                }
		                // gantt.render();
		                // gantt.refreshData();
		            }
    			});
    			frm["project_gantt"] = project_gantt;
    			event_handlers(project_gantt);

    			var els = document.querySelectorAll("input[name='scale']");
				for (var i = 0; i < els.length; i++) {
				    els[i].onclick = function(e){
				        e = e || window.event;
				        var el = e.target || e.srcElement;
				        var value = el.value;
				        setScaleConfig(project_gantt, value);
				        project_gantt.render();
				    };
				}

			});
		}
	}
});

function single_date(e){
	// console.log(e);
}
function grid_table(project_gantt){

	project_gantt.form_blocks["my_editor"] = {
	    render:function(sns) {
	    	console.log(sns);
	        return `<div class='dhx_cal_ltext' style='height:120px;'>
					<table id="myTable" class=" table order-list">
					    <thead>
					        <tr>
					            <td>Resource Name</td>
					            <td>Percentage</td>
					        </tr>
					    </thead>
					    <tbody>
					        <tr>
					            <td class="col-sm-6">
					                <input type="text" name="resource_name" class="form-control" />
					            </td>
					            <td class="col-sm-4">
					                <input type="text" name="percentage"  class="form-control"/>
					            </td>
					            <td class="col-sm-2"><a class="deleteRow"></a>

					            </td>
					        </tr>
					    </tbody>
					    <tfoot>
					        <tr>
					            <td colspan="2" style="text-align: left;">
					                <input type="button" class="btn btn-primary" id="addrow" value="Add Row" />
					            </td>
					        </tr>
					        <tr>
					        </tr>
					    </tfoot>
					</table>
	        </div>`;
	    },
	    set_value:function(node, value, task,section) {
	    	// console.log(node.childNodes);
	        // node.childNodes[1].value = value || "";
	        // node.childNodes[4].value = task.users || "";
	    },
	    get_value:function(node, task,section) {
	        // task.users = node.childNodes[4].value;
	        // return node.childNodes[1].value;
	    },
	    focus:function(node) {
	        // var a = node.childNodes[1];
	        // a.select();
	        // a.focus();
	    }
	};
}


function add_additional_data(project_gantt, task, project_name){
	if(task){
		// task comes from db
		if ("name" in task){

			// console.log(task["type"])
			var exp_start_date = moment(task.exp_start_date).format("DD-MM-YYYY HH:mm:ss");
			var exp_end_date = moment(task.exp_end_date).format("DD-MM-YYYY HH:mm:ss");

			task["id"] = task.name;
			// task["duration"] = task_duration;
			task["text"] = task.subject;
			task["start_date"] = exp_start_date;
			task["doctype"] = "Task";
			task["end_date"] = exp_end_date;

			if(task["is_milestone"] != 1){
				
					
				task["progress"] = task["progress"] / 100;
			}

			if(!task.parent_task){
				task["parent"] = project_name;
			}
			else{
				task["parent"] = task["parent_task"];

				
			}
			

			// var task_duration = moment(task.exp_end_date).diff(task.exp_start_date, "days");

			
			// project_gantt.addTask(task);
		}
		// console.log(exp_start_date);
		// console.log(task["start_date"]);
		// console.log(exp_end_date);
		// console.log(task["end_date"]);
		// var state = gantt.getState();
		// console.log(state);
		// task newly added to gantt
		// else{
			
		// 	task["project"] = project_name;

		// }
		
	}
}

function event_handlers(project_gantt){

	project_gantt.form_blocks.select.button_click = function(index,button,shead,sbody){

		// var idx = x++;`
		// project_gantt.config.lightbox.sections.push();
		// var opened_task = project_gantt.getState().lightbox;
		// project_gantt.resetLightbox(); 
		// project_gantt.hideLightbox();
		// project_gantt.showLightbox(opened_task);
		// console.log(project_gantt.getLightboxSection('test').getValue());
    	// project_gantt.getLightboxSection("test").test();
    	// console.log(opened_task);
  //   	return true;
    	// project_gantt.showLightbox();
	}
	// var types = project_gantt.config.links;
	// project_gantt.attachEvent("onAfterTaskUpdate", function(id,item){
		

	// 	// console.log(item.progress);
	// });
	project_gantt.attachEvent("onLightbox", function(id) {

		var task = project_gantt.getTask(id);
		if (task.type == "task"){
			// console.log(task.priority);
			// console.log(project_gantt.getLightboxSection('priority'));
			project_gantt.getLightboxSection('priority').setValue(task.priority);
	    	return true;
		}
	    // console.log(tsk);
	});

	project_gantt.attachEvent("onAfterTaskDelete", function(id,item){
    	if("name" in item){
    		frappe.call({
	            method: 'frappe.client.delete',
	            args: {
	                'doctype': 'Task',
	                'name': item['name']
	            },
	            freeze: true,
	            freeze_message: "Deleting Task..",
	            // async: false,
	            callback: function(r) {
	            	// console.log(r.message);
	            }
		    });
    	}
	});

	project_gantt.attachEvent("onAfterLinkDelete", function(id,item){
    	if("name" in item){
    		frappe.call({
	            method: 'pmo.project_services.doctype.project_gantt.project_gantt.delete_link',
	            args: {
	                'link_name': item['name']
	            },
	            freeze: true,
	            freeze_message: "Deleting Link..",
	            // async: false,
	            callback: function(r) {
	            	// console.log(r.message);
	            }
		    });
    	}
	});

	project_gantt.attachEvent("onAfterLinkAdd", function(id,item){
    	// console.log(item);
	});

	project_gantt.attachEvent("onAfterTaskAdd", function(id,task){
		// console.log(task);
		// console.log(project_gantt.getChildren(task["id"]));
		// console.log(task["id"]);
		// console.log(task.doctype);
		if(task["type"] == "task"){
			// console.log("dddddd");
			
			if(project_gantt.getChildren(task["id"]).length > 0){
				task["is_group"] = 1;
				// console.log(task);
			}
			else{
				task["is_group"] = 0;
				// console.log(task);
			}
		}
		// console.log(task);
		// if(cur_frm.doc.project){
	  //   		add_additional_data(project_gantt, task, cur_frm.doc.project)
	  //   	}
	});

	// project_gantt.attachEvent("onBeforeTaskAdd", function(id,task){
	// 	if(task.doctype != "Project"){
	// 		task["type"]=project_gantt.config.types.task;
	// 	}
	// });

	// project_doc["type"]=project_gantt.config.types.project;
	// project_gantt.attachEvent("onLinkValidation", function(link){
	// 	// if (link.type == "1" || link.type == "2" || link.type == "3"){
	// 	// 	return false;
	// 	// }
	// });
}

function calculate_progress(project_gantt){
	/*calculate progress dynamically */
	(function dynamicTaskType() {
		var delTaskParent;

		function checkParents(id) {
			setTaskType(id);
			var parent = project_gantt.getParent(id);
			if (parent != project_gantt.config.root_id) {
				checkParents(parent);
			}
		}

		function setTaskType(id) {
			id = id.id ? id.id : id;
			var task = project_gantt.getTask(id);

			// console.log("ddddddddddddddddddd");
			// console.log(project_gantt.getChildren(task.id).length);
			// console.log("ddddddddddddddddddd");

			// var type = project_gantt.getChildren(task.id).length > 0 ? project_gantt.config.types.project : project_gantt.config.types.task;
			var type = "";
			if (project_gantt.getChildren(task.id).length > 0){
				type = project_gantt.config.types.project;
			}
			else if(task.type == "task"){
				type = project_gantt.config.types.task;
			}

			else if(task.type == "milestone"){
				type = project_gantt.config.types.milestone;
			}

			if (type != task.type) {
				task.type = type;
				project_gantt.updateTask(id);
			}
		}

		project_gantt.attachEvent("onParse", function () {
			project_gantt.eachTask(function (task) {
				setTaskType(task);
			});
		});

		// I think there is no need for this

		project_gantt.attachEvent("onAfterTaskAdd", function(id) {
			project_gantt.batchUpdate(checkParents(id));

		});

		project_gantt.attachEvent("onBeforeTaskDelete", function onBeforeTaskDelete(id, task) {
			delTaskParent = project_gantt.getParent(id);
			return true;
		});

		project_gantt.attachEvent("onAfterTaskDelete", function onAfterTaskDelete(id, task) {
			if (delTaskParent != project_gantt.config.root_id) {
				project_gantt.batchUpdate(checkParents(delTaskParent));
			}
		});

	})();

	// recalculate progress of summary tasks when the progress of subtasks changes
	(function dynamicProgress() {

		function calculateSummaryProgress(task) {
			if (task.type != project_gantt.config.types.project)
				return task.progress;
			var totalToDo = 0;
			var totalDone = 0;
			project_gantt.eachTask(function (child) {
				if (child.type != project_gantt.config.types.project) {
					totalToDo += child.duration;
					totalDone += (child.progress || 0) * child.duration;
				}
			}, task.id);
			if (!totalToDo) return 0;
			else return totalDone / totalToDo;
		}

		function refreshSummaryProgress(id, submit) {
			if (!project_gantt.isTaskExists(id))
				return;

			var task = project_gantt.getTask(id);
			task.progress = calculateSummaryProgress(task);

			if (!submit) {
				project_gantt.refreshTask(id);
			} else {
				project_gantt.updateTask(id);
			}

			if (!submit && project_gantt.getParent(id) !== project_gantt.config.root_id) {
				refreshSummaryProgress(project_gantt.getParent(id), submit);
			}
		}


		project_gantt.attachEvent("onParse", function () {
			project_gantt.eachTask(function (task) {
				task.progress = calculateSummaryProgress(task);
			});
		});

		project_gantt.attachEvent("onAfterTaskUpdate", function (id) {
			refreshSummaryProgress(project_gantt.getParent(id), true);

		});

		project_gantt.attachEvent("onTaskDrag", function (id) {
			refreshSummaryProgress(project_gantt.getParent(id), false);
		});
		project_gantt.attachEvent("onAfterTaskAdd", function (id) {
			refreshSummaryProgress(project_gantt.getParent(id), true);
		});


		(function () {
			var idParentBeforeDeleteTask = 0;
			project_gantt.attachEvent("onBeforeTaskDelete", function (id) {
				idParentBeforeDeleteTask = project_gantt.getParent(id);
			});
			project_gantt.attachEvent("onAfterTaskDelete", function () {
				refreshSummaryProgress(idParentBeforeDeleteTask, true);
			});
		})();
	})();

	// project_gantt.config.lightbox.sections = [
	// 	{name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
	// 	{name: "time", type: "duration", map_to: "auto"}
	// ];
	project_gantt.config.scale_unit = "month";
	project_gantt.config.date_scale = "%F, %Y";

	project_gantt.config.scale_height = 50;
	// project_gantt.config.skip_off_time = true;
	project_gantt.config.subscales = [
		{unit: "day", step: 1, date: "%j, %D"}
	];

	project_gantt.templates.progress_text = function (start, end, task) {
		return "<span style='text-align:left;'>" + Math.round(task.progress * 100) + "% </span>";
	};

	project_gantt.templates.task_class = function (start, end, task) {
		if (task.type == project_gantt.config.types.project)
			return "hide_project_progress_drag";
	};

}

function setScaleConfig(gantt, level) {
    switch (level) {
        case "day":
            gantt.config.scale_unit = "day";
            gantt.config.step = 1;
            gantt.config.date_scale = "%d %M";
            gantt.templates.date_scale = null;
 
            gantt.config.scale_height = 27;
 
            gantt.config.subscales = [];
            break;
        case "week":
            var weekScaleTemplate = function (date) {
              var dateToStr = gantt.date.date_to_str("%d %M");
              var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
              return dateToStr(date) + " - " + dateToStr(endDate);
            };
 
            gantt.config.scale_unit = "week";
            gantt.config.step = 1;
            gantt.templates.date_scale = weekScaleTemplate;
 
            gantt.config.scale_height = 50;
 
            gantt.config.subscales = [
                {unit: "day", step: 1, date: "%D"}
            ];
            break;
        case "month":
            gantt.config.scale_unit = "month";
            gantt.config.date_scale = "%F, %Y";
            gantt.templates.date_scale = null;
 
            gantt.config.scale_height = 50;
 
            gantt.config.subscales = [
                {unit: "day", step: 1, date: "%j, %D"}
            ];
 
            break;
        case "year":
            gantt.config.scale_unit = "year";
            gantt.config.step = 1;
            gantt.config.date_scale = "%Y";
            gantt.templates.date_scale = null;
 
            gantt.config.min_column_width = 50;
            gantt.config.scale_height = 90;
 
            gantt.config.subscales = [
                {unit: "month", step: 1, date: "%M"}
            ];
            break;
    }
}