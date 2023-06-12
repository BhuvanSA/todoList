//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(
	"mongodb+srv://admin-bhuvansa:soptuj-3faxso-Hemzun@cluster69854.lyy6og1.mongodb.net/todolistDB",
);

const itemSchema = {
	name: String,
};

const listSchema = {
	name: String,
	items: [itemSchema],
};

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
	name: "Welcome to your todolist!",
});

const item2 = new Item({
	name: "Hit the + button to add a new item.",
});

const item3 = new Item({
	name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems)
// 	.then(() => {
// 		console.log("Insertion Successfull");
// 	})
// 	.catch((err) => {
// 		console.log("An error occured :" + err);
// 	});

app.get("/", function(req, res) {
	Item.find()
		.then((foundItems) => {
			res.render("list", { listTitle: "Today", newListItems: foundItems });
		})
		.catch((err) => {
			console.log("An error occured : $(err)", err);
		});
});

app.post("/", function(req, res) {
	const itemName = req.body.newItem;
	const listName = req.body.list;

	const item = new Item({
		name: itemName,
	});

	if (listName === "Today") {
		item.save().then(() => {
			res.redirect("/");
		});
	} else {
		List.findOne({ name: listName })
			.then((foundList) => {
				foundList.items.push(item);
				foundList
					.save()
					.then(() => res.redirect("/" + listName))
					.catch(() => "something went wrong!");
			})
			.catch(() => {
				console.log("something went wrong");
			});
	}
});

app.post("/delete", function(req, res) {
	const checkedItemID = req.body.checkbox;
	const listName = req.body.listName;

	if (listName === "Today") {
		Item.findByIdAndRemove(checkedItemID)
			.then(() => {
				res.redirect("/");
			})
			.catch(() => {
				console.log("Something went wrong in /delete");
			});
	} else {
		List.findOneAndUpdate(
			{ name: listName },
			{ $pull: { items: { _id: checkedItemID } } },
		)
			.then(() => {
				res.redirect("/" + listName);
			})
			.catch(() => {
				console.log("Something went wroong in /delete");
			});
	}
});

app.get("/:customlistName", function(req, res) {
	const customListName = _.capitalize(req.params.customlistName);

	List.findOne({ name: customListName })
		.then((foundList) => {
			if (!foundList) {
				// Create a new list
				const list = new List({
					name: customListName,
					items: defaultItems,
				});

				list.save().then(() => {
					res.redirect("/" + customListName);
				});
			} else {
				// Show an existing list

				res.render("list", {
					listTitle: foundList.name,
					newListItems: foundList.items,
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

app.post("/work", function(req, res) {
	const item = req.body.newItem;
	workItems.push(item);
	res.redirect("/work");
});

app.get("/about", function(req, res) {
	res.render("about");
});

app.listen(3000, function() {
	console.log("Server started on port 3000");
});
