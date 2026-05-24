// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from '@openzeppelin/contracts/access/AccessControl.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

/// @title AcademicCredential
/// @notice Stores tamper-evident academic credential metadata and verification state.
contract AcademicCredential is AccessControl, ReentrancyGuard {
    bytes32 public constant INSTITUTION_ADMIN_ROLE = keccak256('INSTITUTION_ADMIN_ROLE');

    struct Certificate {
        uint256 tokenId;
        address studentAddress;
        string ipfsHash;
        string studentName;
        string programName;
        string graduationDate;
        string institutionName;
        uint256 issueDate;
        bool isRevoked;
        string certificateId;
    }

    event CertificateIssued(uint256 tokenId, address studentAddress, string certificateId, string ipfsHash);
    event CertificateRevoked(string certificateId, uint256 timestamp);

    mapping(uint256 => Certificate) private _certificates;
    mapping(bytes32 => uint256) private _certificateIdToTokenId;
    mapping(address => uint256[]) private _studentCertificates;
    mapping(uint256 => bool) private _certificateExists;

    uint256 private _nextTokenId = 1;

    error InvalidAddress();
    error EmptyValue();
    error CertificateAlreadyExists();
    error CertificateNotFound();
    error CertificateAlreadyRevoked();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Grants institution admin privileges to an account.
    function grantInstitutionAdmin(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(INSTITUTION_ADMIN_ROLE, account);
    }

    /// @notice Revokes institution admin privileges from an account.
    function revokeInstitutionAdmin(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(INSTITUTION_ADMIN_ROLE, account);
    }

    /// @notice Issues a new academic certificate and stores its metadata on-chain.
    function issueCertificate(
        address studentAddress,
        string calldata ipfsHash,
        string calldata studentName,
        string calldata programName,
        string calldata graduationDate,
        string calldata institutionName,
        string calldata certificateId
    ) external onlyRole(INSTITUTION_ADMIN_ROLE) nonReentrant returns (uint256 tokenId) {
        if (studentAddress == address(0)) revert InvalidAddress();
        if (bytes(ipfsHash).length == 0 || bytes(studentName).length == 0 || bytes(programName).length == 0) {
            revert EmptyValue();
        }
        if (bytes(graduationDate).length == 0 || bytes(institutionName).length == 0 || bytes(certificateId).length == 0) {
            revert EmptyValue();
        }

        bytes32 certificateKey = keccak256(bytes(certificateId));
        if (_certificateIdToTokenId[certificateKey] != 0) revert CertificateAlreadyExists();

        tokenId = _nextTokenId++;

        Certificate storage certificate = _certificates[tokenId];
        certificate.tokenId = tokenId;
        certificate.studentAddress = studentAddress;
        certificate.ipfsHash = ipfsHash;
        certificate.studentName = studentName;
        certificate.programName = programName;
        certificate.graduationDate = graduationDate;
        certificate.institutionName = institutionName;
        certificate.issueDate = block.timestamp;
        certificate.isRevoked = false;
        certificate.certificateId = certificateId;

        _certificateIdToTokenId[certificateKey] = tokenId;
        _certificateExists[tokenId] = true;
        _studentCertificates[studentAddress].push(tokenId);

        emit CertificateIssued(tokenId, studentAddress, certificateId, ipfsHash);
    }

    /// @notice Returns the certificate data and a boolean flag that indicates whether it is currently valid.
    function verifyCertificate(string calldata certificateId)
        external
        view
        returns (Certificate memory certificate, bool isValid)
    {
        uint256 tokenId = _certificateIdToTokenId[keccak256(bytes(certificateId))];
        if (tokenId == 0) {
            return (certificate, false);
        }

        certificate = _certificates[tokenId];
        isValid = _certificateExists[tokenId] && !certificate.isRevoked;
    }

    /// @notice Returns a certificate by token ID.
    function getCertificate(uint256 tokenId) external view returns (Certificate memory) {
        if (!_certificateExists[tokenId]) revert CertificateNotFound();
        return _certificates[tokenId];
    }

    /// @notice Returns every certificate issued to a specific student wallet.
    function getCertificatesByStudent(address student) external view returns (Certificate[] memory) {
        uint256[] storage studentTokenIds = _studentCertificates[student];
        Certificate[] memory certificates = new Certificate[](studentTokenIds.length);

        for (uint256 index = 0; index < studentTokenIds.length; index++) {
            certificates[index] = _certificates[studentTokenIds[index]];
        }

        return certificates;
    }

    /// @notice Revokes a certificate permanently by its public certificate ID.
    function revokeCertificate(string calldata certificateId) external onlyRole(INSTITUTION_ADMIN_ROLE) nonReentrant {
        uint256 tokenId = _certificateIdToTokenId[keccak256(bytes(certificateId))];
        if (tokenId == 0) revert CertificateNotFound();

        Certificate storage certificate = _certificates[tokenId];
        if (certificate.isRevoked) revert CertificateAlreadyRevoked();

        certificate.isRevoked = true;
        emit CertificateRevoked(certificateId, block.timestamp);
    }

    /// @notice Returns true when a certificate exists and has not been revoked.
    function isValidCertificate(string calldata certificateId) external view returns (bool) {
        uint256 tokenId = _certificateIdToTokenId[keccak256(bytes(certificateId))];
        if (tokenId == 0) {
            return false;
        }

        return _certificateExists[tokenId] && !_certificates[tokenId].isRevoked;
    }

    /// @notice Returns the current total number of issued certificates.
    function totalCertificates() external view returns (uint256) {
        return _nextTokenId - 1;
    }
}