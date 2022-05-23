//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

// import "../node_modules/hardhat/console.sol";

contract VotingSystem {
    struct candidate {
        address candAddress;
        string name;
        string proposal;
        uint256 votes;
    }

    struct voter {
        address voterAddress;
        string name;
        bool voted; //default value is false
    }

    event NewCandidate(
        address indexed candAdd,
        string name,
        string proposal,
        uint256 votes
    );
    event NewVoter(address indexed voterAdd, string name, bool voted);

    candidate[] public candArr;
    voter[] public voterArr;

    address manager;
    bool votingAllowed;

    constructor() {
        manager = msg.sender;
    }

    function isManager(address _ad) public view returns (bool) {
        return (_ad == manager);
    }

    function addVoter(address _voterAddress, string memory _voterName) public {
        require(msg.sender == manager);

        for (uint256 i = 0; i < voterArr.length; i++) {
            require(_voterAddress != voterArr[i].voterAddress);
        }

        voterArr.push(voter(_voterAddress, _voterName, false));
        emit NewVoter(_voterAddress, _voterName, false);
    }

    function addCandidate(
        address _candAddress,
        string memory _candName,
        string memory _candProposal
    ) public {
        require(msg.sender == manager);

        for (uint256 i = 0; i < candArr.length; i++) {
            require(_candAddress != candArr[i].candAddress);
        }

        candArr.push(candidate(_candAddress, _candName, _candProposal, 0));
        emit NewCandidate(_candAddress, _candName, _candProposal, 0);
    }

    function getCandidates() public view returns (candidate[] memory) {
        return candArr;
    }

    function getVoters() public view returns (voter[] memory) {
        return voterArr;
    }

    function voteCandidate(address _candAddress) public {
        require(votingAllowed, "Voting not allowed yet");
        require(msg.sender != manager);

        uint256 flag = 0;
        uint256 pos = 0;

        for (uint256 i = 0; i < voterArr.length; i++) {
            if (msg.sender == voterArr[i].voterAddress) {
                pos = i;
                flag = 1;
            }
        }

        require(flag == 1);
        require(!voterArr[pos].voted);

        for (uint256 i = 0; i < candArr.length; i++) {
            if (_candAddress == candArr[i].candAddress) {
                candArr[i].votes = candArr[i].votes + 1;
                voterArr[pos].voted = true;
                emit NewCandidate(
                    _candAddress,
                    candArr[i].name,
                    candArr[i].proposal,
                    candArr[i].votes
                );
                emit NewVoter(
                    voterArr[i].voterAddress,
                    voterArr[i].name,
                    voterArr[i].voted
                );
            }
        }
    }

    function startVoting() public {
        require(msg.sender == manager);
        votingAllowed = true;
    }

    function votingStatus() public view returns (bool voteAllow) {
        return votingAllowed;
    }

    function candWinner()
        public
        view
        returns (
            address _candAddress,
            string memory _name,
            string memory _proposal,
            uint256 _votes
        )
    {
        require(!votingAllowed);
        uint256 maxVotes = 0;
        uint256 pos = 0;

        for (uint256 i = 0; i < candArr.length; i++) {
            if (maxVotes < candArr[i].votes) {
                pos = i;
            }
        }

        return (
            candArr[pos].candAddress,
            candArr[pos].name,
            candArr[pos].proposal,
            candArr[pos].votes
        );
    }

    function endVoting() public {
        require(msg.sender == manager);
        votingAllowed = false;
    }

    function resetVoters() public {
        require(msg.sender == manager);
        delete voterArr;
    }

    function resetCandidates() public {
        require(msg.sender == manager);
        delete candArr;
    }
}
