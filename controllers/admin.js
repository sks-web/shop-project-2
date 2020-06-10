const Product = require("../models/product");
const { validationResult } = require("express-validator/check");
const fileHelper = require("../util/file");

exports.getAddProduct = (req, res, next) => {
  // if(!req.session.isLoggedIn) {
  //     return res.redirect("/login");
  // }
  res.render("admin/edit-product", {
    pageTitle: "Add Product Page",
    path: "/admin/addProduct",
    editing: false,
    errorMessage: null,
    validateError: [],
    ifError: false,
  });
};

exports.addProduct = (req, res, next) => {
  const title = req.body.productName;
  const image = req.file;
  const description = req.body.description;
  const price = req.body.price;
  console.log(image);

  if (!image) {
    return res.status("422").render("admin/edit-product", {
      pageTitle: "Add Product Page",
      path: "/admin/addProduct",
      editing: false,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: "Enter data is not an image",
      validateError: [],
      ifError: true,
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status("422").render("admin/edit-product", {
      pageTitle: "Add Product Page",
      path: "/admin/addProduct",
      editing: false,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validateError: errors.array(),
      ifError: true,
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.session.user,
  });
  product
    .save()
    .then((result) => {
      console.log("Data Added To Database!");
      res.redirect("/admin/product");
    })
    .catch((err) => {
      // console.log("Error occured!");
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product Page",
        path: "/admin/editProduct",
        editing: editMode,
        product: product,
        errorMessage: null,
        validateError: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodID = req.body.productId;
  const updatedTitle = req.body.productName;
  const updatePrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  Product.findById(prodID)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatePrice;
      product.description = updatedDesc;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then((result) => {
        console.log("Product Updated!");
        res.redirect("/admin/product");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
      res.redirect("/500");
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id")
    // .populate("userId", "name")
    .then((product) => {
      console.log("Data Fetched");
      res.render("admin/product", {
        pageTitle: "Admin Products",
        path: "/admin/product",
        productList: product,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id })
    })
    .then((result) => {
      console.log(result);
      console.log("Data Deleted");
      res.redirect("/admin/product");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
