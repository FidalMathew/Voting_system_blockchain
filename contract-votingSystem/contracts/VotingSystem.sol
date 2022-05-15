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

    candidate[] public candArr;
    voter[] public voterArr;

    address manager;
    bool votingAllowed;

    constructor() {
        manager = msg.sender;
    }

    function addVoters(address _voterAddress, string memory _voterName)
        public
        returns (voter[] memory)
    {
        require(msg.sender == manager);
        voterArr.push(voter(_voterAddress, _voterName, false));

        return voterArr;
    }

    function addCandidate(
        address _candAddress,
        string memory _candName,
        string memory _candProposal
    ) public returns (candidate[] memory) {
        require(msg.sender == manager);
        candArr.push(candidate(_candAddress, _candName, _candProposal, 0));

        return candArr;
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
        voter memory votePerson;

        for (uint256 i = 0; i < voterArr.length; i++) {
            if (msg.sender == voterArr[i].voterAddress) {
                votePerson = voterArr[i];
                flag = 1;
            }
        }

        require(flag == 1);
        require(!votePerson.voted);

        for (uint256 i = 0; i < candArr.length; i++) {
            if (_candAddress == candArr[i].candAddress) {
                candArr[i].votes = candArr[i].votes + 1;
            }
        }
    }

    function startVoting() public {
        require(msg.sender == manager);
        votingAllowed = true;
    }

    function endVoting() public returns (candidate memory) {
        require(msg.sender == manager);
        votingAllowed = false;

        uint256 maxVotes = 0;
        uint256 pos = 0;

        for (uint256 i = 0; i < candArr.length; i++) {
            if (maxVotes < candArr[i].votes) {
                pos = i;
            }
        }

        return candArr[pos];
    }
}
