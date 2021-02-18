import React from 'react';
import { Link, Redirect } from "react-router-dom";
import FeaturesList from '../../components/Content/FeaturesList';

export default function Home(props) {
  return props.authenticated ? (
    <div className="p-5">
      <h1>{props.translate("Home")}</h1>
    </div>
  ) : (
      <>
        <div className="p-5">
          <h1 className="mb-4">{props.translate("Welcome to Calendarium")}</h1>
          <FeaturesList translate={props.translate} />
          <p className="mt-4">
            {props.translate("Need an account? Sign up")} <Link to="/sign-up">{props.translate("here")}</Link>. |&nbsp;
            {props.translate("Already have an account? Sign in")} <Link to="/sign-in">{props.translate("here")}</Link>.
          </p>
        </div>
      </>
    );
}