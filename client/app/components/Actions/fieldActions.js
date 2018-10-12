/*export function fetchFields() {
    return dispatch => {
      dispatch(fetchFieldsBegin());
      return fetch("/api/account/fields")
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
          dispatch(fetchFieldsSuccess(json));
          return json;
        })
        .catch(error => dispatch(fetchFieldsFailure(error)));
    };
  }
  
  // Handle HTTP errors since fetch won't.
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.message);
    }
    return response;
  }

export const FETCH_FIELDS_BEGIN   = 'FETCH_FIELDS_BEGIN';
export const FETCH_FIELDS_SUCCESS = 'FETCH_FIELDS_SUCCESS';
export const FETCH_FIELDS_FAILURE = 'FETCH_FIELDS_FAILURE';

export const fetchFieldsBegin = () => ({
  type: FETCH_FIELDS_BEGIN
});

export const fetchFieldsSuccess = fields => ({
  type: FETCH_FIELDS_SUCCESS,
  payload: { fields }
});

export const fetchFieldsError = error => ({
  type: FETCH_FIELDS_FAILURE,
  payload: { error }
});

*/