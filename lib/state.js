"use babel";

const handlers = {
    setActiveFile(state, action) {
        return Object.assign({}, state, {activeFile: action.file})
    },
    setActiveEntity(state, action) {
        return Object.assign({}, state, {
            metadata: state.metadata.map(ent => {
                return Object.assign({}, ent, {ui_active: ent == action.entity});
            })
        })
    },
    setMetadata(state, action) {
        return Object.assign({}, state, {metadata: action.metadata})
    },
}

export default function reducer(state, action) {
    console.log("ACTION", action);
    if (handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state, action);
    }
    return state;
}
