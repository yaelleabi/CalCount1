import { useMemo } from 'react';

import { useCalories } from "../contexts/CalorieContext";

export const CalorieSummary = () => {

    const { entries } = useCalories();

    const summary = useMemo(() => {

        let totalEntry = 0;

        let totalExpense = 0;

        entries.forEach(item => {

            if (item.type === 'entry') {

                totalEntry += item.calories;

            } else {

                totalExpense += item.calories;

            }

        });

        return {

            totalEntry,

            totalExpense,

            balance: totalEntry - totalExpense

        };

    }, [entries]);

    return (

        <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>

            <h2>Résumé</h2>

            <div style={{ display: 'flex', gap: '20px' }}>

                <div>

                    <h3>Total Apport</h3>

                    <p style={{ color: 'green', fontSize: '1.2em' }}>+{summary.totalEntry} kcal</p>

                </div>

                <div>

                    <h3>Total Dépense</h3>

                    <p style={{ color: 'red', fontSize: '1.2em' }}>-{summary.totalExpense} kcal</p>

                </div>

                <div>

                    <h3>Bilan</h3>

                    <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>

                        {summary.balance > 0 ? '+' : ''}{summary.balance} kcal

                    </p>

                </div>

            </div>

        </div>

    );

};