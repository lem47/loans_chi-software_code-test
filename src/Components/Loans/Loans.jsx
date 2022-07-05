import React, { useState } from 'react';
import './Loans.scss';

import loansData from '../../api/current-loans.json';
import { Modal } from '../Modal/Modal';

export const Loans = () => {
  const amountData = loansData.loans.map(loan => loan.amount);
  const amountWithDot = amountData.map(e => e.replace(/,/g, '.'));
  const amountAsNumber = amountWithDot.map(e => Number(e));
  const amountSum = amountAsNumber.reduce((prev, curr) => prev + curr, 0);
  const availableAmount = amountSum.toString().replace(/[.]/g, ',');

  const [money, setMoney] = useState(availableAmount);
  const [modalActive, setModalActive] = useState(false);
  const [chosenLoan, setChosenLoan] = useState('');
  const [investment, setInvestment] = useState('');
  const [invested, setInvested] = useState([]);

  const activeLoan = loansData.loans.find(loan => loan.id === chosenLoan);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');

    setInvestment(Number(value).toLocaleString());
  };

  const investMoney = (inv) => {
    const decreasedAmount = (
      Number(money.replace(/[,]/g, '')) - Number(inv.replace(/[,]/g, ''))
    );

    setMoney(decreasedAmount.toLocaleString(
      'en-US', { minimumFractionDigits: 0 },
    ));
  };

  const showInvestedLoans = (id) => {
    setInvested([...invested, id]);
  };

  const changeAvailable = (id, av, inv) => {
    const changedAmount = (
      Number(av.replace(/[,]/g, '')) - Number(inv.replace(/[,]/g, ''))
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
                <p className="Loans__loan-name">Loan name 1</p>
                <p className="Loans__loan-details">Loan details and values</p>
              </div>
              <div className="Loans__loan-actions">
                <p className={invested.includes(loan.id)
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
            {`$${money}`}
          </p>
        </section>
        <Modal active={modalActive}>
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
                <p className={Number(investment.replace(/[,]/g, ''))
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
                  investMoney(investment);
                  changeAvailable(
                    activeLoan.id,
                    activeLoan.available,
                    investment,
                  );
                  setInvestment('');
                }}
              >
                <input
                  type="text"
                  className="Loans__modal-input"
                  placeholder="1,000"
                  value={investment}
                  onChange={handleChange}
                  required
                />
                <button
                  type="submit"
                  className={Number(investment.replace(/[,]/g, ''))
                    - Number(activeLoan.available.replace(/[,]/g, '')) > 0
                    ? 'Loans__loan-button disabled' : 'Loans__loan-button'}
                >
                  Invest
                </button>
              </form>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};
