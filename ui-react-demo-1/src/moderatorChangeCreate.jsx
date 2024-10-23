const ParentComp = () => {
    const [moderatorECN, setModeratorECN] = useState([]);  // State in parent for moderator ECN

    const handleModeratorECNUpdate = (updatedECN) => {
        setModeratorECN(updatedECN);  // Update moderator ECN when passed from child
    };

    return (
        <div>
            <h3>Parent Component</h3>
            <p>Moderator ECNs: {moderatorECN.join(', ')}</p> {/* Display ECNs in parent */}
            <ModeratorECN onModeratorECNUpdate={handleModeratorECNUpdate} />
        </div>
    );
};


const ModeratorECN = ({ onModeratorECNUpdate }) => {
    const dispatch = useDispatch();
    const userList = useSelector(getUsers);
    const [inputModeratorText, setInputModeratorText] = useState("");
    const [isModeratorLoading, setIsModeratorLoading] = useState(false);
    const [showModeratorSuggestions, setShowModeratorSuggestions] = useState(false);
    const [moderatorECN, setModeratorECN] = useState([]);  // Local state for ECNs
    const [selectedModerators, setSelectedModerators] = useState([]);  // Local state for selected moderators

    useEffect(() => {
        // Notify parent whenever the moderator ECN list is updated
        onModeratorECNUpdate(moderatorECN);
    }, [moderatorECN, onModeratorECNUpdate]);

    const handleModeratorInputChange = (e) => {
        setInputModeratorText(e.target.value);
        debounceInputChange(e.target.value);
        if (e.target.value === "" || e.nativeEvent.inputType === "deleteContentBackward" || e.target.value.trim() === "") {
            setShowModeratorSuggestions(false);
        }
    };

    const debounceInputChange = useCallback(
        debounce((value) => {
            setIsModeratorLoading(true);
            dispatch(LoadUsers(value)).then(() => {
                setIsModeratorLoading(false);
                setShowModeratorSuggestions(true);
            });
        }, 300),
        []
    );

    const handleModeratorSet = (moderator) => {
        if (!moderatorECN.includes(moderator.ecn)) {
            setModeratorECN((prevECN) => [...prevECN, moderator.ecn]);  // Add ECN to local state
            setSelectedModerators((prevMods) => [...prevMods, moderator]);  // Add full moderator to local state
        }
        setInputModeratorText("");
        setShowModeratorSuggestions(false);
    };

    const handleRemoveModerator = (moderator) => {
        setModeratorECN((prevECN) => prevECN.filter((ecn) => ecn !== moderator.ecn));  // Remove ECN
        setSelectedModerators((prevMods) => prevMods.filter((item) => item.ecn !== moderator.ecn));  // Remove moderator
    };

    return (
        <div className="row margin-1-t">
            <div className="col-md-2 display-inline-block valign-top pad-1-t text-uppercase font-weight-medium dls-gray-05">
                Moderator
            </div>
            <div className="col-md-4">
                <input
                    type="text"
                    className="form-control"
                    value={inputModeratorText}
                    onChange={handleModeratorInputChange}
                    placeholder="Search Moderator"
                    style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
                />
                {showModeratorSuggestions && userList.data && (
                    <div className="suggestions" style={{ overflowY: "scroll", maxHeight: "200px" }}>
                        {userList.data.map((moderator) => (
                            <div
                                className="suggestion border-dark"
                                key={moderator.ecn}
                                onClick={() => handleModeratorSet(moderator)}
                            >
                                {moderator.fullName} - ({moderator.ecn})
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {isModeratorLoading && <div className={"loader margin-1-t"}></div>}
            <div className="col-md-4" style={{ color: "blue", fontStyle: "italic", borderColor: "gray" }}>
                {selectedModerators.length > 0 && <h5>Selected Moderators:</h5>}
                {selectedModerators.map((moderator) => (
                    <div key={moderator.ecn}>
                        {moderator.fullName} - {moderator.ecn}
                        <button
                            type="button"
                            className="border-dark margin-1-1 margin-1-r margin-1-tb"
                            style={{ borderRadius: "5px", borderColor: "red" }}
                            onClick={() => handleRemoveModerator(moderator)}
                        >
                            -x
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
