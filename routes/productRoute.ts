import express from 'express'
import Controller from '../controller/productController'

const router = express.Router()

router.route("/search").get(Controller.SearchProduct)
router.route("/").get(Controller.getAllProduct)
router.route("/:id").get(Controller.getProductById)
router.route("/relatedProduct/:id").get(Controller.getRelatedProduct)

export default router