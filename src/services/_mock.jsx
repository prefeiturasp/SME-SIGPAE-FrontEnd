import axios from "./_base";
import MockAdapter from "axios-mock-adapter";

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

export default mock;
