import { Context } from "./../index";
import "reflect-metadata";
import {
  Resolver,
  ResolverInterface,
  Arg,
  Query,
  Mutation,
  Ctx
} from "type-graphql";
import SignUpForm from "./types";
import SignUpFormInput from "./input";

@Resolver()
export default class SignUpFormResolver {
  @Mutation(returns => SignUpForm)
  async submitForm(
    @Arg("formInput")
    { email, phone, q1, q2, q3, q4, mailing }: SignUpFormInput,
    @Ctx() context: Context
  ): Promise<SignUpForm> {
    await context.firebaseDb.ref("test").push({
      email: email || "",
      phone: phone || "",
      q1,
      q2,
      q3,
      q4,
      mailing
    });
    return new SignUpForm(q1, q2, q3, q4, mailing, email, phone);
  }
}