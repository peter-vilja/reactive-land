module.exports = function () {
  console.log('-- Applictive algebras ------------------');

  var id = (a) => a;
  console.log('a.of(function(a) { return a; }).ap(v) is equivalent to v (identity)');
  console.log(Behavior.of(id).ap(Behavior(5)), Behavior(5));

  console.log('a.of(f).ap(a.of(x)) is equivalent to a.of(f(x)) (homomorphism)');
  console.log(Behavior.of(id).ap(Behavior.of(3)), Behavior.of(id(3)));

  var u = Behavior.of(v => v + 1);
  var y = Behavior.of(3);
  console.log('u.ap(a.of(y)) is equivalent to a.of(function(f) { return f(y); }).ap(u) (interchange)');
  console.log(u.ap(y), Behavior.of(f => f(3)).ap(u));

  console.log('--------------------');

  console.log('-- Chain algebras -----------------------');

  var addOne = value => Behavior.of(value + 1);
  var addTwo = value => Behavior.of(value + 2);
  console.log('m.chain(f).chain(g) is equivalent to m.chain(function(x) { return f(x).chain(g); }) (associativity)')
  console.log(Behavior.of(3).chain(addOne).chain(addTwo), Behavior(3).chain(x => addOne(x).chain(addTwo)));

  console.log('--------------------');

  console.log('-- Monad algebras -----------------------');

  console.log('m.of(a).chain(f) is equivalent to f(a) (left identity)');
  console.log(Behavior.of(2).chain(id), id(2));
  console.log('m.chain(m.of) is equivalent to m (right identity)');
  console.log(Behavior.of(2).chain(Behavior.of), Behavior.of(2));

  console.log('--------------------');
};
