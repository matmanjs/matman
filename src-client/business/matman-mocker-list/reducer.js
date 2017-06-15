const initialState = {
  isLoaded: false,

  list: [],
};

function mockerListInfo(state = initialState, action) {
  let { type, data } = action,
    update = {};

  switch (type) {

  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

export default mockerListInfo;

