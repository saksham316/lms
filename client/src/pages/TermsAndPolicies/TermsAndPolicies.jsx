import React from 'react'
import styles from "./TermsAndPolicies.module.css"

const TermsAndPolicies = () => {
  return (
  <div className='d-flex justify-content-center'>
     <div className={styles.tapContainer}>
   <h3 className='text-center py-4'>TERMS AND POLICIES</h3>
    <h4> User Access and Authentication:</h4>
    <p>Access to the Learning Management System (LMS) is restricted to authorized company employees only.
Each employee must have a unique user ID and a secure password for LMS access.
Sharing of login credentials is strictly prohibited.</p>

<h4>Data Confidentiality:</h4>
<p>All information and materials within the LMS are confidential and proprietary.
Unauthorized copying, sharing, or dissemination of LMS materials is strictly prohibited.
Employees must not disclose sensitive LMS information to unauthorized individuals.
</p>

<h4>Usage Policy:</h4>
<p>The LMS is designated for professional learning and development purposes only.
Misuse of the LMS for non-educational activities is not permitted.
The company reserves the right to monitor LMS usage for audit, security, and improvement purposes.</p>

<h4>Intellectual Property Rights:</h4>
<p>

All content within the LMS is the intellectual property of the company or its content providers.
Unauthorized use, reproduction, or modification of LMS content is strictly prohibited.</p>

<h4>Security and Data Protection:</h4>
<p>Users are required to adhere to the company's data security and protection policies.
Any suspicious activities or breaches must be reported to the IT department or appropriate authority immediately.
The company implements measures to secure the LMS against unauthorized access.</p>

<h4>Consequences of Policy Violations:</h4>
<p>Violations of LMS policies may result in disciplinary action, including termination.
Legal action may be taken against individuals breaching confidentiality or intellectual property rights.</p>

<h4>Policy Amendments:</h4>
<p>The company reserves the right to amend LMS policies at any time.
Employees will be notified of policy changes, and it is their responsibility to stay informed about the latest LMS policies.</p>

<h4>Acknowledgment of Policies:</h4>
<p>By using the LMS, employees acknowledge and agree to abide by the terms and policies outlined above.</p>

   </div>
  </div>
  )
}

export default TermsAndPolicies