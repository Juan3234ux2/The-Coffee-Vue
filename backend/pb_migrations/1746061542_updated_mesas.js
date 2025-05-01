/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2204324178")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number1778359835",
    "max": null,
    "min": null,
    "name": "pos_x",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number519614093",
    "max": null,
    "min": null,
    "name": "pos_y",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number3823758020",
    "max": null,
    "min": null,
    "name": "cantidad_sillas",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2204324178")

  // remove field
  collection.fields.removeById("number1778359835")

  // remove field
  collection.fields.removeById("number519614093")

  // remove field
  collection.fields.removeById("number3823758020")

  return app.save(collection)
})
