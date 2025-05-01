/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2204324178")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number3447976795",
    "max": null,
    "min": null,
    "name": "numero",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2204324178")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number3447976795",
    "max": null,
    "min": null,
    "name": "numero_mesa",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
