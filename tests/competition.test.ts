import * as sinon from "sinon";
import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");

import { app } from "../app";
import User from "../database/models/users";
import { userMock, tokenMock } from "./mocks/login.mocks";

import { Response } from "superagent";

chai.use(chaiHttp);

const { expect } = chai;

describe("Testa o endpoint /login", () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(User, "findOne").resolves(userMock as User);
  });

  after(() => {
    (User.findOne as sinon.SinonStub).restore();
  });

  it("Testa que se o Login for feito com sucesso o seu retorno do endpoint está correto", async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post("/login")
      .send({ email: "admin@admin.com", password: "batman" });

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.have.property("user");
    expect(chaiHttpResponse.body.user.id).to.equal(1);
    expect(chaiHttpResponse.body.user.username).to.equal("Admin");
    expect(chaiHttpResponse.body.user.email).to.equal("admin@admin.com");
    expect(chaiHttpResponse.body.user.role).to.equal("admin");
    expect(chaiHttpResponse.body).to.have.property("token");
  });

  it("Testa que se a senha estiver incorreta não é possivel fazer login", async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post("/login")
      .send({ email: "admin@admin.com", password: "wrong_password" });

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.have.property("message");
    expect(chaiHttpResponse.body.message).to.be.equal(
      "Incorrect email or password"
    );
  });

  it("Testa que se o email estiver incorreto não é possivel fazer login", async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post("/login")
      .send({ email: "wrong_email", password: "secret_admin" });

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.have.property("message");
    expect(chaiHttpResponse.body.message).to.be.equal(
      "Incorrect email or password"
    );
  });

  it("Testa que se o email não for informado não é possivel fazer login", async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post("/login")
      .send({ password: "secret_admin" });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.have.property("message");
    expect(chaiHttpResponse.body.message).to.be.equal(
      "All fields must be filled"
    );
  });

  it("Testa que se a senha não for informado não é possivel fazer login", async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post("/login")
      .send({ email: "admin@admin.com" });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.have.property("message");
    expect(chaiHttpResponse.body.message).to.be.equal(
      "All fields must be filled"
    );
  });

  it("Testa que o retorno do endpoit /login/validate está correto", async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get("/login/validate")
      .set({ authorization: tokenMock });

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.equal("admin");
  });
});
