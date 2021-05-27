import React from 'react';
import { Component } from 'react';
import { relocateItemInArray } from '../utils/utils';

export default class VotingPanel extends Component {

  state = {
    suggestions: [],
    voteOrder: null,
  }

  async componentDidMount() {
    try {
      // fetch all the data for each suggestion and save that
      this.setState({ suggestions: this.props.suggestions });
      
      // create a voteOrder array
      this.setState({ voteOrder: this.props.suggestions.map(book => book.googleId) });
    }
    catch (err) {
      console.log(err);
    }
  }

  handleOrderChange = e => {
    // get the old and new index
    let oldIndex = Number(this.state.voteOrder.indexOf(e.target.name));
    let newIndex = Number(e.target.value - 1);

    // figure out new order
    const newOrder = relocateItemInArray(this.state.voteOrder, oldIndex, newIndex);
    this.setState({ voteOrder: newOrder });

    console.log(this.state.voteOrder);
  }

  handleVoteClick = e => {
    e.preventDefault();
    
    this.props.onVote(this.state.voteOrder);
    e.target.disabled = true;
  }

  render() {

    console.log('Signed in as: ', this.props.currentUser);

    return (
      <div className="VotingPanel panel">
        <p>This ballot uses ranked choice voting to vote. Please put the books in the order that you most desire to read them.</p>
        <ul>
          {Boolean(this.state.voteOrder) && this.state.suggestions.map(book => (
            <li className="book-candidate" key={book.googleId}>
              <input name={book.googleId} onChange={this.handleOrderChange} type="number" min="1" max={this.state.suggestions.length} value={this.state.voteOrder.indexOf(book.googleId) + 1}/>
              <img src={book.image ? book.image : '/assets/nocover.jpeg'} alt={book.title} />
              <div>
                <p>{book.title}{book.subtitle && <span>: {book.subtitle}</span>}</p>
                <p className="book-author">{book.authors[0]}</p>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={this.handleVoteClick} disabled={!Boolean(this.props.currentUser)}>submit your vote{!Boolean(this.props.currentUser) && ' (please sign in)'}</button>
      </div>
    );
  }

}