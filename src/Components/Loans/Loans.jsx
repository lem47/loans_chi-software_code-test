import React, { useState } from 'react';
import './Loans.scss';

import loansData from '../../api/current-loans.json';
import { Modal } from '../Modal/Modal';

export const Loans = () => {
  // preparing initial data for render in app
  const arrOfAmounts = loansData.loans.map(loan => loan.amount);
  const amountsWithDot = arrOfAmounts.map(amount => amount.replace(/,/g, '.'));
  const amountsAsNumbers = amountsWithDot.map(amount => Number(amount));
  const sumOfAmounts = amountsAsNumbers.reduce((prev, curr) => prev + curr, 0);
  const availableAmount = sumOfAmounts.toString().replace(/[.]/g, ',');

  const [availableMoney, setAvailableMoney] = useState(availableAmount);
  const [modalActive, setModalActive] = useState(false);
  const [chosenLoan, setChosenLoan] = useState('');
  const [investmentValue, setInvestmentValue] = useState('');
  const [investedLoans, setInvestedLoans] = useState([]);

  // find chosen loan by id for rendering right data in popup
  const activeLoan = loansData.loans.find(loan => loan.id === chosenLoan);

  // helper function for input validation
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');

    setInvestmentValue(Number(value).toLocaleString());
  };

  // helper function for rendering total amount available for investment
  const investMoney = (investment) => {
    const decreasedAmount = (
      Number(availableMoney.replace(/[,]/g, ''))
      - Number(investment.replace(/[,]/g, ''))
    );

    setAvailableMoney(decreasedAmount.toLocaleString(
      'en-US', { minimumFractionDigits: 0 },
    ));
  };

  // helper function for accounting loans that you have invested in
  // and rendering some visual indication
  const showInvestedLoans = (id) => {
    setInvestedLoans([...investedLoans, id]);
  };

  // helper function for decreasing loan available amount
  const changeAvailable = (id, available, investment) => {
    const changedAmount = (
      Number(available.replace(/[,]/g, ''))
      - Number(investment.replace(/[,]/g, ''))
    );

    const loanToChange = loansData.loans.find(loan => loan.id === id);

    loanToChange.available = changedAmount.toLocaleString(
      'en-US', { minimumFractionDigits: 0 },
    );
  };

  return (
    <>
      <div className="Loans">
        <div className="Loans__loans-wrapper">
          {loansData.loans.map(loan => (
            <div className="Loans__loan-block" key={loan.id}>
              <div className="Loans__loan-title">
                <p className="Loans__loan-name">Loan name</p>
                <p className="Loans__loan-details">Loan details and values</p>
              </div>
              <div className="Loans__loan-actions">
                <p className={investedLoans.includes(loan.id)
                  ? 'Loans__loan-invested active'
                  : 'Loans__loan-invested'}
                >
                  Invested
                </p>
                <button
                  type="button"
                  className="Loans__loan-button"
                  onClick={(event) => {
                    event.preventDefault();
                    setModalActive(true);
                    setChosenLoan(loan.id);
                  }}
                >
                  Invest
                </button>
              </div>
            </div>
          ))}
        </div>
        <section className="Loans__amount-remain">
          <p>
            Total amount available for investment:
          </p>
          <p>
            {`$${availableMoney}`}
          </p>
        </section>
        <Modal active={modalActive}>
          <>
            {activeLoan && (
              <div className="Loans__modal-container">
                <button
                  type="button"
                  className="Loans__close-button"
                  onClick={(event) => {
                    event.preventDefault();
                    setModalActive(false);
                    setChosenLoan('');
                  }}
                >
                  ╳
                </button>
                <p className="Loans__modal-slogan">
                  Invest in Loan
                </p>
                <p className="Loans__modal-title">
                  {activeLoan.title}
                </p>
                <div className="Loans__modal-details">
                  <p className={Number(investmentValue.replace(/[,]/g, ''))
                    - Number(activeLoan.available.replace(/[,]/g, '')) > 0
                    && 'Loans__loan-error'}
                  >
                    {`Amount available: $${activeLoan.available}`}
                  </p>
                  <p>
                    {`Loan ends in: ${Math.floor(
                      activeLoan.term_remaining / 86400,
                    )} days`}
                  </p>
                </div>
                <p className="Loans__modal-amount">
                  Investment amount
                </p>
                <form
                  className="Loans__modal-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setModalActive(false);
                    showInvestedLoans(activeLoan.id);
                    investMoney(investmentValue);
                    changeAvailable(
                      activeLoan.id,
                      activeLoan.available,
                      investmentValue,
                    );
                    setInvestmentValue('');
                  }}
                >
                  <input
                    type="text"
                    className="Loans__modal-input"
                    placeholder="1,000"
                    value={investmentValue}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="submit"
                    className={Number(investmentValue.replace(/[,]/g, ''))
                      - Number(activeLoan.available.replace(/[,]/g, '')) > 0
                      ? 'Loans__loan-button disabled' : 'Loans__loan-button'}
                  >
                    Invest
                  </button>
                </form>
              </div>
            )}
          </>
        </Modal>
      </div>
    </>
  );
};
