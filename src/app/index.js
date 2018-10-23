import React 		from 'react';
import ReactDom	from 'react-dom';
import registerServiceWorker from  "./registerServiceWorker";
import { Router, Route, Switch} from 'react-router-dom';
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { LandingPage, Listings, NotFound, Login, Signup, ServiceProviders, ContactPage, ProfilePage, UserPage } from 'views';
import store from './store';
import 'css/App.css';

var mPoint = document.getElementById('root'),
hist = createBrowserHistory();

let LandingPageComponent = ()=>{
	return(
		<Provider store={store}>
			<LandingPage />
		</Provider>
	)
}

let ContactComponent = ()=>{
	return(
		<Provider store={store}>
			<ContactPage />
		</Provider>
	)
}

let UserPageComponent = ()=>{
	return(
		<Provider store={store}>
			<UserPage />
		</Provider>
	)
}

let ProfilePageComponent = ()=>{
	return(
		<Provider store={store}>
			<ProfilePage />
		</Provider>
	)
}

let ListingComponent = ()=>{
	return(
		<Provider store={store}>
			<Listings />
		</Provider>
	)
}

let ServiceProvidersComponent = ()=>{
	return(
		<Provider store={store}>
			<ServiceProviders />
		</Provider>
	)
}

let LoginComponent = ()=>{
	return(
		<Provider store={store}>
			<Login />
		</Provider>
	)
}

let SignupComponent = ()=>{
	return(
		<Provider store={store}>
			<Signup/>
		</Provider>
	)
}

let NotFoundComponent = ()=>{
	return(
		<Provider store={store}>
			<NotFound/>
		</Provider>
	)
}

let Root = ()=>{
	return(
		<Router history={hist} basename = "/" >
			<div className="main">
				<Switch>
					<Route exact path="/" component={ LandingPageComponent } />
					<Route exact path="/home" component={ LandingPageComponent } />
					<Route exact path="/userPage:uid" component={ UserPageComponent } />
					<Route exact path="/profilePage:uid" component={ ProfilePageComponent } />
					<Route exact path="/listings" component={ ListingComponent } />
					<Route exact path="/service-providers" component={ ServiceProvidersComponent } />
					<Route exact path="/contact" component={ ContactComponent } />
					<Route exact path="/login" component={ LoginComponent } />
					<Route exact path="/signup" component={ SignupComponent } />
					<Route component={ NotFoundComponent } />
				</Switch>
			</div>
		</Router>
	)
}
ReactDom.render(
	<Root/>,mPoint
)
registerServiceWorker();