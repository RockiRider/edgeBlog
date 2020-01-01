var apiRouter = express.Router();

apiRouter.get("/", homePageController);
apiRouter.get("/post/:id", getPostController);
apiRouter.get("/posts/new", oidc.ensureAuthenticated(), createPostController);
apiRouter.post("/posts/store", oidc.ensureAuthenticated(), storePostController);
apiRouter.get("/admin", oidc.ensureAuthenticated(), getAdminController);
apiRouter.get("/logout", getLogoutController);