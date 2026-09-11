
// 1. CARD TYPE

type Card = {
    id: string;
    title: string;
    column: "todo" | "doing" | "done";
};


// 2. KANBAN STATE

type KanbanState = {
    cards: Card[];
};


// 3. DISCRIMINATED UNION ACTIONS

type KanbanAction =
    | {
        type: "ADD_CARD";
        card: Card;
    }
    | {
        type: "REMOVE_CARD";
        cardId: string;
    }
    | {
        type: "MOVE_CARD";
        cardId: string;
        from: "todo" | "doing" | "done";
        to: "todo" | "doing" | "done";
    };


// 4. GENERIC CREATE STORE

function createStore<
    S,
    A extends { type: string }
>(
    initialState: S,
    reducer: (state: S, action: A) => S
) {

    // Current state
    let state = initialState;

    // All subscribed listeners
    const listeners: Array<(state: S) => void> = [];


    // GET STATE

    function getState(): S {
        return state;
    }


    // DISPATCH
    // ----------------------------------------

    function dispatch(action: A): void {

        // Reducer creates new state
        state = reducer(state, action);

        // Notify all listeners
        listeners.forEach(listener => {
            listener(state);
        });
    }


    // SUBSCRIBE

    function subscribe(
        listener: (state: S) => void
    ): () => void {

        // Add listener
        listeners.push(listener);


        // Return unsubscribe function
        return () => {

            const index = listeners.indexOf(listener);

            if (index !== -1) {
                listeners.splice(index, 1);
            }
        };
    }


    return {
        getState,
        dispatch,
        subscribe
    };
}


// 5. KANBAN REDUCER

function kanbanReducer(
    state: KanbanState,
    action: KanbanAction
): KanbanState {

    switch (action.type) {

        // ADD CARD

        case "ADD_CARD":

            return {
                ...state,

                cards: [
                    ...state.cards,
                    action.card
                ]
            };


        // REMOVE CARD

        case "REMOVE_CARD":

            return {
                ...state,

                cards: state.cards.filter(
                    card => card.id !== action.cardId
                )
            };


        // MOVE CARD

        case "MOVE_CARD":

            return {
                ...state,

                cards: state.cards.map(card => {

                    if (card.id === action.cardId) {

                        return {
                            ...card,
                            column: action.to
                        };
                    }

                    return card;
                })
            };
    }
}


// 6. CREATE KANBAN STORE

const store = createStore<KanbanState, KanbanAction>(
    {
        cards: []
    },
    kanbanReducer
);


// 7. SUBSCRIBE TO STATE CHANGES

const unsubscribe = store.subscribe((state) => {

    console.log("STATE UPDATED:");
    console.log(state);

});


// 8. ADD CARD

store.dispatch({
    type: "ADD_CARD",

    card: {
        id: "1",
        title: "Learn TypeScript",
        column: "todo"
    }
});


// 9. ADD ANOTHER CARD

store.dispatch({
    type: "ADD_CARD",

    card: {
        id: "2",
        title: "Learn Generics",
        column: "todo"
    }
});


// 10. MOVE CARD

store.dispatch({
    type: "MOVE_CARD",

    cardId: "1",
    from: "todo",
    to: "doing"
});


// 11. REMOVE CARD

store.dispatch({
    type: "REMOVE_CARD",

    cardId: "2"
});


// 12. GET CURRENT STATE
console.log("CURRENT STATE:");

console.log(
    store.getState()
);


unsubscribe();


// INVALID EXAMPLES

//  Invalid action type

// store.dispatch({
//     type: "DELETE_CARD"
// });


//  Missing required property

// store.dispatch({
//     type: "REMOVE_CARD"
// });


//  Wrong column

// store.dispatch({
//     type: "MOVE_CARD",
//     cardId: "1",
//     from: "todo",
//     to: "invalid"
// });


// Wrong card type

// store.dispatch({
//     type: "ADD_CARD",
//     card: {
//         id: "3",
//         title: "Test",
//         column: "wrong"
//     }
// });