frappe.pages['projects-gantt'].on_page_load = function(wrapper) {
	var me = this;
	var project_doc = {};
	console.log("page load");

	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Projects Gantt',
		single_column: true
	});

	page.main.html(frappe.render_template("projects_gantt", {}));
	var project = frappe.ui.form.make_control({
		parent: page.main.find("p.project-wrap"),
		df: {
			fieldtype: "Link",
			options: "Project",
			fieldname: "project",
			change: function(){
				console.log("change");

			}
		},
		// only_input: true,
	});
	project.refresh();

	me.page.set_primary_action(__("Save"), function() {

		gantt_tasks = [];

		project_gantt.eachTask(function(task){
			gantt_tasks.push(task);
	});

		// console.log(gantt_tasks);


		frappe.call({
            method: 'pmo.project_services.page.projects_gantt.projects_gantt.save_tasks',
            args: {
                'tasks': gantt_tasks
            },
            freeze: true,
            freeze_message: "Saving Data..",
            // async: false,
            callback: function(r) {
            	// console.log(r.message);
            	console.log(gantt_tasks);
            }
        });
		
	});

}

// function get_tasks(project){


// }
// function convert_to_ddmmyyyy(date){
// 	if (date){
// 		var nf_date = new Date(date);
		
// 		var s_days = nf_date.getDate().toString();
// 		var s_months = (nf_date.getMonth()+1).toString();

// 		var days = s_days.length <= 1 ? "0"+ s_days : s_days;
// 		var months = s_months.length <= 1 ? "0"+ s_months : s_months; 
// 		var years = nf_date.getFullYear().toString();
// 		return days+"-"+months+"-"+years;
// 	}
// }

function event_handlers(project_gantt){
	// project_gantt.attachEvent("onAfterTaskUpdate", function(id,item){
    	
	// });
	// project_gantt.attachEvent("onAfterLinkAdd", function(id,item){
 //    	console.log(item);
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
			var type = project_gantt.hasChild(task.id) ? project_gantt.config.types.project : project_gantt.config.types.task;
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

		project_gantt.attachEvent("onAfterTaskAdd", function onAfterTaskAdd(id) {
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

	project_gantt.config.lightbox.sections = [
		{name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
		{name: "time", type: "duration", map_to: "auto"}
	];

	project_gantt.config.scale_unit = "month";
	project_gantt.config.date_scale = "%F, %Y";

	project_gantt.config.scale_height = 50;

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